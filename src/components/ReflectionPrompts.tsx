type Props = {
  prompts: string[];
};

export function ReflectionPrompts({ prompts }: Props) {
  return (
    <section className="panel stack-md">
      <div className="section-header">
        <div>
          <p className="eyebrow">Take Your Time</p>
          <h2>Some prompts to help</h2>
        </div>
        <p className="section-copy">You don't have to answer all of these — just let them spark some honest thinking.</p>
      </div>
      <ul className="prompt-list">
        {prompts.map((prompt) => (
          <li key={prompt}>{prompt}</li>
        ))}
      </ul>
    </section>
  );
}
