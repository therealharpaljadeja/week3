//[assignment] write your own unit test to show that your Mastermind variation circuit is working as expected
const chai = require("chai");
const path = require("path");
const buildPoseidon = require("circomlibjs").buildPoseidon;

const wasm_tester = require("circom_tester").wasm;

const assert = chai.assert;

describe("String Mastermind test", function () {
	it("Check if the code breaker broke the code", async () => {
		const circuit = await wasm_tester(
			path.join(
				__dirname,
				"../contracts/circuits/MastermindVariation.circom"
			)
		);
		await circuit.loadConstraints();
		let poseidon = await buildPoseidon();
		let F = poseidon.F;
		let res = poseidon([1213123, 7, 1, 13, 5, 19]);

		const INPUT = {
			pubGuessA: "7",
			pubGuessB: "1",
			pubGuessC: "13",
			pubGuessD: "5",
			pubGuessE: "19",
			pubSolnHash: F.toObject(res),
			pubNumHit: "5",
			pubNumBlow: "0",
			privSolnA: "7",
			privSolnB: "1",
			privSolnC: "13",
			privSolnD: "5",
			privSolnE: "19",
			privSalt: "1213123",
		};
		const witness = await circuit.calculateWitness(INPUT, true);
		assert(F.eq(F.e(witness[1]), F.e(res)));
	});
});
