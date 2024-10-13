use anchor_lang::prelude::*;

declare_id!("Declare_the_program_ID");

/// Main program module for managing the storage of design on the Solana blockchain.
///
/// This module provides functionality to store design data in a Solana account.
#[program]
mod design {
    use super::*;

    pub fn store_design(ctx: Context<StoreDesign>, json_data: String) -> Result<()> {
        let design_account = &mut ctx.accounts.design_account;
        design_account.json_data = json_data.into_bytes();
        Ok(())
    }    
}

/// Accounts structure for the store_design function.
///
/// Contains the accounts required to store the design data.
#[derive(Accounts)]
pub struct StoreDesign<'info> {

    /// The account where the design data will be stored.
    #[account(init, payer = user, space = 8 + 4 + 1024)]
    pub design_account: Account<'info, DesignAccount>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

/// Struct representing the design account that stores design data.
#[account]
pub struct DesignAccount {
    pub json_data: Vec<u8>, /// hold the JSON data representing
}
