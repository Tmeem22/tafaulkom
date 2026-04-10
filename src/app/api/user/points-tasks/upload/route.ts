import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { getSession } from '@/lib/auth';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'لم يتم اختيار ملف' }, { status: 400 });
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      return NextResponse.json({ error: 'حجم الملف كبير جداً (الأقصى 50MB)' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${nanoid()}-${file.name.replace(/\s+/g, '_')}`;
    const path = join(process.cwd(), 'public/uploads', fileName);
    
    await writeFile(path, buffer);
    const url = `/uploads/${fileName}`;

    return NextResponse.json({ success: true, url });

  } catch (error) {
    console.error('File Upload Error:', error);
    return NextResponse.json({ error: 'فشل في رفع الملف' }, { status: 500 });
  }
}
