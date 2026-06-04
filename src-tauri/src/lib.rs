mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
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
//         .setup(|app| {
//             commands::overlay::start_overlay_ticker(app.handle().clone());
//             Ok(())
//         })
        .invoke_handler(tauri::generate_handler![
            commands::world::get_world_state,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
