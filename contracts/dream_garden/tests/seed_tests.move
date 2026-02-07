#[test_only]
module dream_garden::seed_tests;

use std::string;
use sui::test_scenario::{Self as ts, Scenario};
use sui::coin::{Self, Coin};
use dream_garden::seed::{Self, Seed};

// Mock coin type for testing
public struct MOCK_COIN has drop {}

const OWNER: address = @0xAD;
const OTHER_USER: address = @0xDE;

#[test]
fun test_seed_lifecycle() {
    let mut scenario = ts::begin(OWNER);
    
    // 1. Create Seed
    {
        seed::create_seed<MOCK_COIN>(
            string::utf8(b"Dream Bike"),
            1000,
            string::utf8(b"bike_icon"),
            ts::ctx(&mut scenario)
        );
    };

    // 2. Verify creation and Add Water
    ts::next_tx(&mut scenario, OWNER);
    {
        let mut seed = ts::take_from_sender<Seed<MOCK_COIN>>(&scenario);
        
        assert!(seed::status(&seed) == 1, 0); // STATUS_CREATED
        assert!(seed::balance(&seed) == 0, 0);
        
        // Mint some mock coins and add water
        let water = coin::mint_for_testing<MOCK_COIN>(500, ts::ctx(&mut scenario));
        seed::add_water(&mut seed, water);
        
        assert!(seed::status(&seed) == 2, 0); // STATUS_IN_PROGRESS
        assert!(seed::balance(&seed) == 500, 0);
        
        ts::return_to_sender(&scenario, seed);
    };

    // 3. Partial Withdrawal
    ts::next_tx(&mut scenario, OWNER);
    {
        let mut seed = ts::take_from_sender<Seed<MOCK_COIN>>(&scenario);
        
        let withdrawn = seed::withdraw(&mut seed, 200, ts::ctx(&mut scenario));
        assert!(coin::value(&withdrawn) == 200, 0);
        assert!(seed::balance(&seed) == 300, 0);
        assert!(seed::status(&seed) == 2, 0); // Still IN_PROGRESS
        
        coin::burn_for_testing(withdrawn);
        ts::return_to_sender(&scenario, seed);
    };

    // 4. Reach Goal and Complete
    ts::next_tx(&mut scenario, OWNER);
    {
        let mut seed = ts::take_from_sender<Seed<MOCK_COIN>>(&scenario);
        
        // Add more water to reach 1000
        let water = coin::mint_for_testing<MOCK_COIN>(700, ts::ctx(&mut scenario));
        seed::add_water(&mut seed, water);
        assert!(seed::balance(&seed) == 1000, 0);
        
        let final_funds = seed::complete(&mut seed, ts::ctx(&mut scenario));
        assert!(coin::value(&final_funds) == 1000, 0);
        assert!(seed::status(&seed) == 3, 0); // STATUS_COMPLETED
        
        coin::burn_for_testing(final_funds);
        ts::return_to_sender(&scenario, seed);
    };

    ts::end(scenario);
}

#[test]
fun test_abandon() {
    let mut scenario = ts::begin(OWNER);
    
    // Create and Add some money
    seed::create_seed<MOCK_COIN>(string::utf8(b"Dream"), 1000, string::utf8(b"icon"), ts::ctx(&mut scenario));
    ts::next_tx(&mut scenario, OWNER);
    
    let mut seed = ts::take_from_sender<Seed<MOCK_COIN>>(&scenario);
    let water = coin::mint_for_testing<MOCK_COIN>(100, ts::ctx(&mut scenario));
    seed::add_water(&mut seed, water);
    
    // Abandon
    let funds = seed::abandon(&mut seed, ts::ctx(&mut scenario));
    assert!(coin::value(&funds) == 100, 0);
    assert!(seed::status(&seed) == 4, 0); // STATUS_ABANDONED
    
    coin::burn_for_testing(funds);
    ts::return_to_sender(&scenario, seed);
    ts::end(scenario);
}

#[test]
#[expected_failure(abort_code = dream_garden::seed::EGoalNotReached)]
fun test_complete_fail_too_early() {
    let mut scenario = ts::begin(OWNER);
    
    seed::create_seed<MOCK_COIN>(string::utf8(b"Dream"), 1000, string::utf8(b"icon"), ts::ctx(&mut scenario));
    ts::next_tx(&mut scenario, OWNER);
    
    let mut seed = ts::take_from_sender<Seed<MOCK_COIN>>(&scenario);
    let water = coin::mint_for_testing<MOCK_COIN>(999, ts::ctx(&mut scenario));
    seed::add_water(&mut seed, water);
    
    // This should fail
    let funds = seed::complete(&mut seed, ts::ctx(&mut scenario));
    
    coin::burn_for_testing(funds);
    ts::return_to_sender(&scenario, seed);
    ts::end(scenario);
}

#[test]
#[expected_failure(abort_code = 2)] // EInsufficientBalance
fun test_withdraw_too_much() {
    let mut scenario = ts::begin(OWNER);
    
    seed::create_seed<MOCK_COIN>(string::utf8(b"Dream"), 1000, string::utf8(b"icon"), ts::ctx(&mut scenario));
    ts::next_tx(&mut scenario, OWNER);
    
    let mut seed = ts::take_from_sender<Seed<MOCK_COIN>>(&scenario);
    let water = coin::mint_for_testing<MOCK_COIN>(100, ts::ctx(&mut scenario));
    seed::add_water(&mut seed, water);
    
    // Try to withdraw 101 when only 100 is there
    let funds = seed::withdraw(&mut seed, 101, ts::ctx(&mut scenario));
    
    coin::burn_for_testing(funds);
    ts::return_to_sender(&scenario, seed);
    ts::end(scenario);
}
