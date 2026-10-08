import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth';
import { getSupabaseClient } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  if (!auth.success) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // Validate mime type
    const mimeType = file.type;
    if (!mimeType.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'Only image files are allowed' }, { status: 400 });
    }

    // Size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate safe clean filename
    const ext = path.extname(file.name) || '.jpg';
    const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
    const filename = `${cleanBase}-${Date.now().toString(36)}${ext}`;

    // 1. Cloud Storage: Supabase Storage Bucket ('product-images')
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filename, buffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (!uploadError && uploadData) {
          const { data: publicUrlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(filename);

          if (publicUrlData && publicUrlData.publicUrl) {
            return NextResponse.json({
              success: true,
              url: publicUrlData.publicUrl,
              filename,
            });
          }
        } else if (uploadError) {
          console.warn('[Supabase Storage] Notice: Could not upload to bucket, using fallback.', uploadError.message);
        }
      } catch (storageErr) {
        console.warn('[Supabase Storage] Exception:', storageErr);
      }
    }

    // 2. Local fallback if writable disk available
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${filename}`;
      return NextResponse.json({
        success: true,
        url: publicUrl,
        filename,
      });
    } catch (fsErr) {
      // 3. Serverless fallback: return base64 Data URL if local disk write is not available
      const base64Data = `data:${mimeType};base64,${buffer.toString('base64')}`;
      return NextResponse.json({
        success: true,
        url: base64Data,
        filename,
      });
    }
  } catch (err: any) {
    console.error('[UPLOAD ERROR]', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Image upload failed' },
      { status: 500 }
    );
  }
}
