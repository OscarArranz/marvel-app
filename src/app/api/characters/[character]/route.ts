import { NextResponse } from 'next/server';
import { getCharacter } from '../../../../utils/server/characters';
export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ character: string }> },
) => {
  const name = (await params).character;

  try {
    const character = await getCharacter(name);
    return NextResponse.json(character);
  } catch (error) {
    return NextResponse.json({ error: 'Character not found' }, { status: 404 });
  }
};
