module dream_garden::seed;

use std::string::String;
use sui::balance::{Self, Balance};
use sui::coin::{Self, Coin};

/// Represents a Dream Seed that can hold yield-bearing assets.
public struct Seed<phantom T> has key, store {
    id: UID,
    owner: address,
    name: String,
    target_amount: u64,
    seed_type: String,
    is_finished: bool,
    funds: Balance<T>,
}

/// Create a new seed for a specific coin type T.
public entry fun create_seed<T>(
    name: String,
    target_amount: u64,
    seed_type: String,
    ctx: &mut TxContext
) {
    let seed = Seed<T> {
        id: object::new(ctx),
        owner: ctx.sender(),
        name,
        target_amount,
        seed_type,
        is_finished: false,
        funds: balance::zero(),
    };
    transfer::public_transfer(seed, ctx.sender());
}

/// Add "water" (funds) to the seed.
public entry fun add_water<T>(seed: &mut Seed<T>, water: Coin<T>) {
    seed.funds.join(water.into_balance());
}

/// Withdraw ALL funds and delete the seed (Give up).
public fun withdraw_and_delete<T>(seed: Seed<T>, ctx: &mut TxContext): Coin<T> {
    let Seed { id, owner: _, name: _, target_amount: _, seed_type: _, is_finished: _, funds } = seed;
    id.delete();
    funds.into_coin(ctx)
}

/// Mark the seed as finished and withdraw all funds.
/// Only possible if the target amount has been reached.
public fun finish<T>(seed: &mut Seed<T>, ctx: &mut TxContext): Coin<T> {
    assert!(seed.funds.value() >= seed.target_amount, 0); // Goal reached
    seed.is_finished = true;
    seed.funds.withdraw_all().into_coin(ctx)
}

// Getters for frontend integration
public fun balance<T>(seed: &Seed<T>): u64 {
    seed.funds.value()
}

public fun is_finished<T>(seed: &Seed<T>): bool {
    seed.is_finished
}

public fun name<T>(seed: &Seed<T>): String {
    seed.name
}

public fun target_amount<T>(seed: &Seed<T>): u64 {
    seed.target_amount
}
