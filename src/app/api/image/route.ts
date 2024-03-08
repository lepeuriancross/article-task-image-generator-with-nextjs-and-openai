// Api Route: Fetch Image
/*----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Scripts (node)
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Images
import imgPlaceholder from '/public/placeholder.png';

/*---------- Route ----------*/

export async function POST(request: NextRequest) {
	try {
		// Get body
		const body = await request.json();

		// If no body
		if (!body?.prompt) {
			// Return error - no body
			return new NextResponse('Bad Request', {
				status: 400,
				statusText: 'Bad Request: No prompt provided',
			});
		}

		// If developer mode
		if (process.env.NODE_ENV === 'development') {
			// Return event
			return NextResponse.json(
				{
					message: 'Image generated successfully',
					mode: 'development',
					prompt: body.prompt,
					src: imgPlaceholder.src,
				},
				{
					status: 200,
				}
			);
		}

		// Create openai instance
		const openai = new OpenAI();

		// Fetch image
		const response = await openai.images.generate({
			model: 'dall-e-3',
			prompt: body.prompt,
		});
		const data = response.data;
		const src = data[0].url;

		// Return event
		return NextResponse.json(
			{
				message: 'Image generated successfully',
				mode: 'production',
				prompt: body.prompt,
				src,
			},
			{
				status: 200,
			}
		);
	} catch (error: any) {
		// Return error - generic
		return new NextResponse('Internal Server Error', {
			status: 500,
			statusText: error?.message ?? 'Internal Server Error',
		});
	}
}
