import AdBanner from '@/components/AdBanner';

type ArticleBlock =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] };

function parseArticleBody(body: string): ArticleBlock[] {
  const blocks: ArticleBlock[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length) {
      blocks.push({ type: 'ul', items: listItems });
      listItems = [];
    }
  };

  body
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      if (line.startsWith('### ')) {
        flushList();
        blocks.push({ type: 'h3', text: line.replace(/^###\s+/, '') });
        return;
      }

      if (line.startsWith('## ')) {
        flushList();
        blocks.push({ type: 'h2', text: line.replace(/^##\s+/, '') });
        return;
      }

      if (line.startsWith('- ')) {
        listItems.push(line.replace(/^-\s+/, ''));
        return;
      }

      flushList();
      blocks.push({ type: 'p', text: line });
    });

  flushList();
  return blocks;
}

export default function ArticleBody({
  body,
  adSlotId
}: {
  body: string;
  adSlotId: string;
}) {
  const blocks = parseArticleBody(body);
  let paragraphCount = 0;
  const showAdPlaceholders = process.env.NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS === 'true';

  return (
    <div className="space-y-7 text-lg leading-[1.85] text-zinc-800">
      {blocks.map((block, index) => {
        if (block.type === 'h2') {
          return (
            <h2
              key={`${block.type}-${index}`}
              className="pt-4 text-2xl font-black leading-tight tracking-tight text-kai-navy"
            >
              {block.text}
            </h2>
          );
        }

        if (block.type === 'h3') {
          return (
            <h3 key={`${block.type}-${index}`} className="pt-2 text-xl font-black text-kai-navy">
              {block.text}
            </h3>
          );
        }

        if (block.type === 'ul') {
          return (
            <ul
              key={`${block.type}-${index}`}
              className="list-disc space-y-3 rounded-lg bg-kai-gray px-6 py-5 pl-8 text-base font-medium leading-7 text-zinc-800"
            >
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }

        paragraphCount += 1;

        return (
          <div key={`${block.type}-${index}`}>
            <p>{block.text}</p>
            {showAdPlaceholders && paragraphCount === 3 ? (
              <div className="my-8">
                <AdBanner id={adSlotId} />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
