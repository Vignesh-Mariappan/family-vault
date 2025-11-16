
interface TypographyH2Props {
  text: string;
  additionalClasses: string;
}

export function TypographyH2({ text, additionalClasses }: TypographyH2Props) {
    return (
      <h2 className={`scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 ${additionalClasses}`}>
        {text}
      </h2>
    )
  }
  