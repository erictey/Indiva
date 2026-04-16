type Props = {
  prompts: string[];
};

export function ReflectionPrompts({ prompts }: Props) {
  return (
    <section className="panel stack-md">
      <div className="section-header">
        <div>
          <p className="eyebrow">Guided Reflection</p>
          <h2>Reflection Prompts</h2>
        </div>
        <p className="section-copy">Use these to keep the review honest and specific.</p>
      </div>
      <ul className="prompt-list">
        {prompts.map((prompt) => (
          <li key={prompt}>{prompt}</li>
        ))}
      </ul>
    </section>
  );
}
