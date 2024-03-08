// Data: Content
/*----------------------------------------------------------------------------------------------------*/

// Intro
export const intro = {
	title: "Let's create the perfect birthday cake!",
	body: "Welcome to the ultimate cake generator. Fill in your recipients' details, then answer a few questions and we'll generate the perfect cake!",
	button: 'Start Generating',
};

// Questions and options
export const questions = (
	name: string
): {
	question: string;
	options: string[];
}[] => [
	{
		question: `What's the theme of ${name.split(' ')[0]}'s party?`,
		options: ['Pirate', 'Superhero', 'Princess', 'Animal', 'Space', 'Cowboy'],
	},
	{
		question: `What's ${name.split(' ')[0]}'s favourite flavour`,
		options: ['Chocolate', 'Vanilla', 'Strawberry', 'Red Velvet'],
	},
	{
		question: `What kind of frosting does ${name.split(' ')[0]} prefer?`,
		options: ['Buttercream', 'Fondant', 'Whipped Cream', 'Ganache'],
	},
	{
		question: `What kind of filling does ${name.split(' ')[0]} prefer?`,
		options: ['Chocolate', 'Vanilla', 'Lemon', 'Strawberry'],
	},
	{
		question: `What kind of decorations should we add?`,
		options: ['Sprinkles', 'Fruit', 'Candies', 'Flowers'],
	},
];

// Result
export const result = {
	title: 'Happy Birthday!',
	body: "Here's the perfect birthday cake, just as you ordered. Grab a slice and enjoy!",
	button: 'Start Again',
};
