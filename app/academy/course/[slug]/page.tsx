import { notFound } from 'next/navigation';
import content from '../../../../lib/content';
import markdownToHtml from '../../../../lib/md';

type Props = { params: { slug: string } };

export default async function CoursePage({ params }: Props) {
  const data = await content.readCourse(params.slug);
  if (!data) return notFound();

  const html = markdownToHtml(data.content || '');

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
