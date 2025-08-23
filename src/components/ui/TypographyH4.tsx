interface TypographyH4Props {
	text: string;
	additionalClasses?: string;
}

export function TypographyH4({ text, additionalClasses }: TypographyH4Props) {
	return (
		<h4
			className={
				'scroll-m-20 text-xl font-semibold tracking-tight ' + additionalClasses
			}
		>
			{text}
		</h4>
	);
}
