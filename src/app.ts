import createDatabase from './InMemoryDatabase';

interface IPokemon {
	id: string;
	attack: number;
	defense: number;
}

const PokemonDB = createDatabase<IPokemon>();

const unsubscribe = PokemonDB.getInstance().onAfterAdd(({ value }) => {
	console.log(value);
});

PokemonDB.getInstance().set({
	id: 'Bulbasaur',
	attack: 50,
	defense: 50
});

unsubscribe();

PokemonDB.getInstance().set({
	id: 'Spinosaur',
	attack: 100,
	defense: 20
});

PokemonDB.getInstance().visit((item) => {
	console.log(item);
});

const bestAttack = PokemonDB.getInstance().selectBest(({ attack }) => attack);
const bestDefense = PokemonDB.getInstance().selectBest(({ defense }) => defense);

console.log('--- Best Attack ---');
console.log(bestAttack);

console.log('--- Best Defense ---');
console.log(bestDefense);