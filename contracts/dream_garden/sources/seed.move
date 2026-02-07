module dream_garden::seed;

use std::string::String;
use sui::balance::{Self, Balance};
use sui::coin::Coin;

// Status constants
const STATUS_CREATED: u8 = 1;
const STATUS_IN_PROGRESS: u8 = 2;
const STATUS_COMPLETED: u8 = 3;
const STATUS_ABANDONED: u8 = 4;

// Error codes
const EInvalidStatus: u64 = 0;
const EGoalNotReached: u64 = 1;

/// Represents a Dream Seed that can hold yield-bearing assets.
public struct Seed<phantom T> has key, store {
    id: UID,
    owner: address,
    name: String,
    target_amount: u64,
    seed_type: String,
    status: u8,
    funds: Balance<T>,
}

/// Create a new seed for a specific coin type T.
public fun create_seed<T>(
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
        status: STATUS_CREATED,
        funds: balance::zero(),
    };
    transfer::public_transfer(seed, ctx.sender());
}

/// Add "water" (funds) to the seed.
public fun add_water<T>(seed: &mut Seed<T>, water: Coin<T>) {
    // Only allow adding water if not finished (completed or abandoned)
    assert!(seed.status == STATUS_CREATED || seed.status == STATUS_IN_PROGRESS, EInvalidStatus);
    
    // If it was just created, it's now in progress
    if (seed.status == STATUS_CREATED) {
        seed.status = STATUS_IN_PROGRESS;
    };
    
    seed.funds.join(water.into_balance());
}

/// Mark the seed as finished (completed) and withdraw all funds.
/// Only possible if the target amount has been reached.
public fun complete<T>(seed: &mut Seed<T>, ctx: &mut TxContext): Coin<T> {
    // Must be in a state that can be completed
    assert!(seed.status == STATUS_CREATED || seed.status == STATUS_IN_PROGRESS, EInvalidStatus);
    // Goal must be reached
    assert!(seed.funds.value() >= seed.target_amount, EGoalNotReached);
    
    seed.status = STATUS_COMPLETED;
    seed.funds.withdraw_all().into_coin(ctx)
}

/// Abandon the seed and withdraw all funds.
/// Allowed from created or in-progress states.
public fun abandon<T>(seed: &mut Seed<T>, ctx: &mut TxContext): Coin<T> {
    // Must be in a state that can be abandoned
    assert!(seed.status == STATUS_CREATED || seed.status == STATUS_IN_PROGRESS, EInvalidStatus);
    
    seed.status = STATUS_ABANDONED;
    seed.funds.withdraw_all().into_coin(ctx)
}

/// Withdraw a specific amount from the seed.
/// Allowed from created or in-progress states.
public fun withdraw<T>(seed: &mut Seed<T>, amount: u64, ctx: &mut TxContext): Coin<T> {
    // Must be in a state that can be withdrawn from
    assert!(seed.status == STATUS_CREATED || seed.status == STATUS_IN_PROGRESS, EInvalidStatus);
    // Must have enough funds
    assert!(seed.funds.value() >= amount, 2); // EInsufficientBalance
    
    seed.funds.split(amount).into_coin(ctx)
}

// Getters for frontend integration
public fun balance<T>(seed: &Seed<T>): u64 {
    seed.funds.value()
}

public fun status<T>(seed: &Seed<T>): u8 {
    seed.status
}

public fun name<T>(seed: &Seed<T>): String {
    seed.name
}

public fun target_amount<T>(seed: &Seed<T>): u64 {
    seed.target_amount
}

public fun seed_type<T>(seed: &Seed<T>): String {
    seed.seed_type
}

public fun owner<T>(seed: &Seed<T>): address {
    seed.owner
}
