#[cfg(not(target_os = "windows"))]
mod app_menu;
mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // rustls 0.23 需进程级 crypto provider，否则 WS(tokio-tungstenite) 握手 panic。
    let _ = rustls::crypto::ring::default_provider().install_default();
    let builder = tauri::Builder::default();

    #[cfg(not(target_os = "windows"))]
    let builder = builder.menu(app_menu::build);

    builder
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(
            tauri_plugin_stronghold::Builder::new(|p| {
                use sha2::{Digest, Sha256};
                let mut h = Sha256::new();
                h.update(b"doroframe-stronghold-v1");
                h.update(p.as_bytes());
                h.finalize().to_vec()
            })
            .build(),
        )
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .manage(commands::world::WorldHttp::new())
        .manage(commands::browse::BrowseHttp::new())
        .manage(commands::market::MarketHttp::new())
        .manage(commands::auth::AuthHttp::new())
        .manage(commands::ws::WsManager::new())
        //         .setup(|app| {
        //             commands::overlay::start_overlay_ticker(app.handle().clone());
        //             Ok(())
        //         })
        .invoke_handler(tauri::generate_handler![
            commands::world::get_world_state,
            commands::browse::get_arby,
            commands::browse::get_sp_incursions,
            commands::browse::get_bounty_cycle,
            commands::market::get_market_items,
            commands::market::get_market_orders,
            commands::market::get_orders_recent,
            commands::market::get_orders_top,
            commands::market::get_market_set,
            commands::market::get_riven_weapons,
            commands::market::get_riven_weapon,
            commands::market::get_riven_attributes,
            commands::market::get_lich_weapons,
            commands::market::get_lich_weapon,
            commands::market::get_lich_ephemeras,
            commands::market::get_lich_quirks,
            commands::market::get_sister_weapons,
            commands::market::get_sister_weapon,
            commands::market::get_sister_ephemeras,
            commands::market::get_sister_quirks,
            commands::market::get_ducats,
            commands::market::get_auctions,
            commands::market::search_auctions,
            commands::market::create_auction,
            commands::market::edit_auction,
            commands::market::close_auction,
            commands::market::set_auctions_visibility,
            commands::market::get_user_auctions,
            commands::market::get_my_auction_participant,
            commands::market::get_auction_bids,
            commands::ws::ws_connect,
            commands::ws::ws_subscribe_auction,
            commands::ws::ws_unsubscribe_auction,
            commands::ws::ws_disconnect,
            commands::ws::ws_bid_set,
            commands::ws::ws_bid_remove,
            commands::market::get_user_orders,
            commands::market::create_market_order,
            commands::market::edit_market_order,
            commands::market::edit_market_orders_group,
            commands::market::close_market_order,
            commands::market::delete_market_order,
            commands::auth::market_sign_in,
            commands::auth::market_sign_out,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
