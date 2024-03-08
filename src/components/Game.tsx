// Component: Game
/*----------------------------------------------------------------------------------------------------*/

'use client';

/*---------- Imports ----------*/

// Config
import { intro, questions, result } from '@/data/content';

// Scripts (node)
import { useState } from 'react';
import { usePresence } from 'framer-motion';

// Scripts (local)
import { classNames } from '@/lib/utils';

// Components (node)
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Freeze } from 'react-freeze';

/*---------- Template ----------*/

// Types
export type GameProps = {
	className?: string;
};
export type GameIntroProps = {
	title: string;
	body: string;
	name: string;
	age: number;
	button: string;
	className?: string;
	onUpdateName: (name: string) => void;
	onUpdateAge: (age: number) => void;
	onClickStart: () => void;
};
export type GameQuestionProps = {
	idx: number;
	question: string;
	options: string[];
	answer: string;
	className?: string;
	onClickSelect: (idx: number, option: string) => void;
	onClickPrevious: () => void;
	onClickNext: () => void;
};
export type GameResultProps = {
	fetchState: 'loading' | 'error' | 'success';
	title: string;
	body: string;
	gameImage?: string;
	button: string;
	className?: string;
	onClickStart: () => void;
};

export default function Game(props: GameProps) {
	/*----- Props -----*/

	// Destructure props
	const { className } = props;

	/*----- Store -----*/

	// State - name
	const [gameName, setGameName] = useState<string>('');

	// State - age
	const [gameAge, setGameAge] = useState<number>(18);

	// State - answers
	const [gameAnswers, setAnswers] = useState<string[]>(
		questions('name').map((question) => {
			return question.options[0];
		})
	);

	// State - gameState
	const [gameState, setGameState] = useState<'intro' | 'question' | 'result'>(
		'intro'
	);

	// State - gameFetchState
	const [gameFetchState, setGameFetchState] = useState<
		'loading' | 'error' | 'success'
	>('loading');

	// State - gameCardDirection
	const [gameCardDirection, setGameCardDirection] = useState<
		'forward' | 'backward'
	>('forward');

	// State - gameQuestion
	const [gameQuestion, setGameQuestion] = useState<number>(0);

	// State - gameImage
	const [gameImage, setGameImage] = useState<string>();

	// Context - isPresent
	const [isPresent, safeToRemove] = usePresence();

	/*----- Methods -----*/

	// Function - getPrompt
	const getPrompt = (gameAnswers: string[]): string => {
		const prompt = `Birthday cake for a ${gameAnswers[0]} themed party. The cake is ${gameAnswers[1]} flavored with ${gameAnswers[2]} frosting and ${gameAnswers[3]} filling. The cake is Decorated with ${gameAnswers[4]}. The image is photorealistic. Focus on specific, visually representable elements. Avoid ambiguous language that could be interpreted as including text.`;
		return prompt;
	};

	// Function updateName
	const updateName = (name: string) => {
		setGameName(name);
	};

	// Function - updateAge
	const updateAge = (age: number) => {
		setGameAge(age);
	};

	// Function - startGame
	const startGame = () => {
		setGameCardDirection('forward');
		setAnswers(
			questions('name').map((question) => {
				return question.options[0];
			})
		);
		setGameQuestion(0);
		setTimeout(() => {
			setGameState('question');
		}, 300);
	};

	// Function - selectOption
	const selectOption = (idx: number, answer: string) => {
		let newAnswers = [...gameAnswers];
		newAnswers[idx] = answer;
		setAnswers(newAnswers);
		nextQuestion();
	};

	// Function - previousQuestion
	const previousQuestion = () => {
		setGameCardDirection('backward');
		setTimeout(() => {
			if (gameQuestion > 0) {
				setGameQuestion(gameQuestion - 1);
			} else {
				setGameState('intro');
			}
		}, 300);
	};

	// Function - nextQuestion
	const nextQuestion = () => {
		setGameCardDirection('forward');
		setTimeout(() => {
			if (gameQuestion < questions(gameName).length - 1) {
				setGameQuestion(gameQuestion + 1);
			} else {
				submitAnswers();
			}
		}, 300);
	};

	// Function - submitAnswers
	const submitAnswers = async () => {
		setGameFetchState('loading');
		setGameState('result');

		const prompt = getPrompt(gameAnswers);
		if (process.env.NODE_ENV === 'development') console.log('prompt', prompt);

		const response = await fetch('/api/image', {
			method: 'POST',
			body: JSON.stringify({ prompt }),
		});

		if (!response.ok) {
			setGameFetchState('error');
			if (process.env.NODE_ENV === 'development')
				console.log('error', response.statusText);
			return;
		}

		const data = await response.json();
		if (process.env.NODE_ENV === 'development') console.log('success', data);

		setTimeout(
			() => {
				setGameImage(data.src);
				setGameFetchState('success');
			},
			process.env.NODE_ENV === 'development' ? 3000 : 0
		);
	};

	/*----- Init -----*/

	// Return default
	return (
		<div className={classNames('game w-full', className)}>
			<div className="game__container">
				<AnimatePresence mode="wait">
					{gameState === 'intro' ? (
						<motion.div
							className="game__card-wrapper--intro w-full max-w-screen-sm mx-auto"
							initial={{
								opacity: 0,
								x: gameCardDirection === 'forward' ? 100 : -100,
							}}
							animate={{ opacity: 1, x: 0 }}
							exit={{
								opacity: 0,
								x: gameCardDirection === 'forward' ? -100 : 100,
							}}
							transition={{ duration: 0.3 }}
							onAnimationComplete={() => {
								if (!isPresent) {
									safeToRemove();
								}
							}}
						>
							<Freeze freeze={!isPresent}>
								<GameIntro
									{...intro}
									name={gameName}
									age={gameAge}
									onUpdateName={updateName}
									onUpdateAge={updateAge}
									onClickStart={startGame}
								/>
							</Freeze>
						</motion.div>
					) : gameState === 'question' && questions.length > 0 ? (
						<motion.div
							key={`game-card-wrapper-${gameQuestion}`}
							className="game__card-wrapper--result w-full max-w-screen-sm mx-auto"
							initial={{
								opacity: 0,
								x: gameCardDirection === 'forward' ? 100 : -100,
							}}
							animate={{ opacity: 1, x: 0 }}
							exit={{
								opacity: 0,
								x: gameCardDirection === 'forward' ? -100 : 100,
							}}
							transition={{ duration: 0.3 }}
							onAnimationComplete={() => {
								if (!isPresent) {
									safeToRemove();
								}
							}}
						>
							<Freeze freeze={!isPresent}>
								<GameQuestion
									idx={gameQuestion}
									question={questions(gameName)[gameQuestion].question}
									options={questions(gameName)[gameQuestion].options}
									answer={gameAnswers[gameQuestion]}
									onClickSelect={selectOption}
									onClickPrevious={previousQuestion}
									onClickNext={nextQuestion}
								/>
							</Freeze>
						</motion.div>
					) : gameState === 'result' ? (
						<motion.div
							className="game__card-wrapper--result w-full max-w-screen-sm mx-auto"
							initial={{
								opacity: 0,
								x: gameCardDirection === 'forward' ? 100 : -100,
							}}
							animate={{ opacity: 1, x: 0 }}
							exit={{
								opacity: 0,
								x: gameCardDirection === 'forward' ? -100 : 100,
							}}
							transition={{ duration: 0.3 }}
							onAnimationComplete={() => {
								if (!isPresent) {
									safeToRemove();
								}
							}}
						>
							<Freeze freeze={!isPresent}>
								<GameResult
									fetchState={gameFetchState}
									{...result}
									gameImage={gameImage}
									onClickStart={startGame}
								/>
							</Freeze>
						</motion.div>
					) : null}
				</AnimatePresence>
			</div>
		</div>
	);
}

function GameIntro(props: GameIntroProps) {
	/*----- Props -----*/

	// Destructure props
	const {
		title,
		body,
		name,
		age,
		button,
		className,
		onUpdateName,
		onUpdateAge,
		onClickStart,
	} = props;

	/*----- Init -----*/

	// Return default
	return (
		<div
			className={classNames(
				'game__card--intro w-full p-6 rounded-lg lg:p-8 bg-white text-gray-900',
				className
			)}
		>
			<h2 className="game__title font-semibold text-2xl">{title}</h2>
			<p className="game__body mt-6">{body}</p>
			<div
				className={classNames(
					`game__inputs mt-8 rounded-t-lg p-6 pb-8 space-y-4 text-left transition-color duration-200`,
					name == '' ? 'bg-gray-100' : 'bg-indigo-100'
				)}
			>
				<div className="game__input">
					<label className="block text-sm font-medium leading-6" htmlFor="name">
						Recipient Name
					</label>
					<div className="mt-2">
						<input
							className="block w-full rounded-md border-0 px-3 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600"
							type="name"
							name="name"
							id="name"
							placeholder="Name"
							defaultValue={name}
							onChange={(e) => onUpdateName(e.target.value)}
						/>
					</div>
				</div>
				<div className="game__input">
					<label className="block text-sm font-medium leading-6" htmlFor="age">
						How old are they?
					</label>
					<div className="mt-2">
						<input
							className="block w-full rounded-md border-0 px-3 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600"
							type="number"
							name="age"
							id="age"
							defaultValue={age}
							onChange={(e) => onUpdateAge(parseInt(e.target.value))}
						/>
					</div>
				</div>
			</div>
			<div className="game__buttons flex flex-col justify-stretch items-stretch sm:flex-row">
				<button
					className={classNames(
						`game__button w-full rounded-b-md px-3.5 py-3 text-sm lg font-semibold shadow-sm transition-color duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`,
						name == ''
							? 'pointer-events-none bg-gray-200 text-gray-400'
							: 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600'
					)}
					type="button"
					disabled={name == ''}
					onClick={onClickStart}
				>
					{button}
				</button>
			</div>
		</div>
	);
}

function GameQuestion(props: GameQuestionProps) {
	/*----- Props -----*/

	// Destructure props
	const {
		idx,
		question,
		options,
		answer,
		className,
		onClickSelect,
		onClickPrevious,
		onClickNext,
	} = props;

	/*----- Init -----*/

	// Return default
	return (
		<div
			className={classNames(
				'game__card--question w-full p-6 rounded-lg lg:p-8 bg-white text-gray-900',
				className
			)}
		>
			<h2 className="game__title font-semibold text-2xl">{question}</h2>
			<ul className="game__inputs grid mt-8 rounded-t-lg p-6 pb-8 gap-4 text-left sm:grid-cols-2 bg-indigo-100">
				{options.map((option) => (
					<li
						key={option}
						className="game__option"
						onClick={() => onClickSelect(idx, option)}
					>
						<button
							className={classNames(
								`game__button w-full border rounded-md px-3.5 py-3 text-sm font-semibold transition-color duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`,
								option === answer
									? 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-500 hover:border-indigo-500 focus-visible:outline-indigo-600'
									: 'bg-white border-gray-300 hover:border-indigo-600'
							)}
							type="button"
							onClick={() => onClickSelect(idx, option)}
						>
							{option}
						</button>
					</li>
				))}
			</ul>
			<div className="game__buttons flex flex-col justify-stretch items-stretch divide-y-[1px] sm:flex-row sm:divide-y-0 sm:divide-x-[1px] divide-indigo-100">
				<button
					className="game__button w-full px-3.5 py-3 text-sm lg font-semibold shadow-sm transition-color duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:rounded-bl-md bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600"
					type="button"
					onClick={onClickPrevious}
				>
					Previous
				</button>
				<button
					className="game__button w-full rounded-b-md px-3.5 py-3 text-sm lg font-semibold shadow-sm transition-color duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:rounded-bl-none bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600"
					type="button"
					onClick={onClickNext}
				>
					Next
				</button>
			</div>
		</div>
	);
}

function GameResult(props: GameResultProps) {
	/*----- Props -----*/

	// Destructure props
	const {
		fetchState,
		title,
		body,
		gameImage,
		button,
		className,
		onClickStart,
	} = props;

	/*----- Init -----*/

	// Return default
	return (
		<div
			className={classNames(
				'game__card--result w-full p-6 rounded-lg lg:p-8 bg-white text-gray-900',
				className
			)}
		>
			{fetchState === 'success' && gameImage ? (
				<>
					<h2 className="game__title font-semibold text-2xl">{title}</h2>
					<p className="game__body mt-6">{body}</p>
					{gameImage && (
						<Image
							className="game__image block w-full h-auto rounded-t-md mt-6"
							src={gameImage}
							alt="Your birthday cake"
							width={1024}
							height={1024}
						/>
					)}
					<div className="game__buttons flex flex-col justify-stretch items-stretch sm:flex-row">
						<button
							className="game__button w-full rounded-b-md px-3.5 py-3 text-sm lg font-semibold shadow-sm transition-color duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600"
							type="button"
							onClick={onClickStart}
						>
							{button}
						</button>
					</div>
				</>
			) : fetchState === 'error' ? (
				<>
					<h2 className="game__title font-semibold text-2xl">Oops!</h2>
					<p className="game__body mt-6">
						There was an error fetching your cake. Please refresh the page and
						try again
					</p>
				</>
			) : (
				<>
					<h2 className="game__title font-semibold text-2xl animate-pulse">
						Baking...
					</h2>
					<p className="game__body mt-6">Hold tight while we heat the oven</p>
				</>
			)}
		</div>
	);
}
