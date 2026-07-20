use tauri::menu::Menu;
#[cfg(target_os = "macos")]
use tauri::menu::{AboutMetadataBuilder, MenuItemKind, PredefinedMenuItem};
use tauri::{AppHandle, Runtime};

pub fn build<R: Runtime>(app: &AppHandle<R>) -> tauri::Result<Menu<R>> {
    let menu = Menu::default(app)?;

    #[cfg(target_os = "macos")]
    customize_macos_about(app, &menu)?;

    Ok(menu)
}

#[cfg(target_os = "macos")]
fn customize_macos_about<R: Runtime>(app: &AppHandle<R>, menu: &Menu<R>) -> tauri::Result<()> {
    let Some(MenuItemKind::Submenu(app_submenu)) = menu.items()?.into_iter().next() else {
        return Ok(());
    };
    let Some(MenuItemKind::Predefined(default_about)) = app_submenu.items()?.into_iter().next()
    else {
        return Ok(());
    };

    let version = app.package_info().version.to_string();
    let about_icon =
        tauri::image::Image::from_bytes(include_bytes!("../icons/icon.png"))?.to_owned();
    let metadata = AboutMetadataBuilder::new()
        .name(Some("DoroFrame"))
        .version(Some(version))
        // AppKit reads CFBundleVersion when this field is absent, which duplicates
        // the marketing version because Tauri uses the same value for both.
        .short_version(Some(""))
        .copyright(Some("Copyright © 2026 Yawanaika"))
        .icon(Some(about_icon))
        .build();
    let about = PredefinedMenuItem::about(app, Some("关于 DoroFrame"), Some(metadata))?;

    app_submenu.set_text("DoroFrame")?;
    app_submenu.remove(&default_about)?;
    app_submenu.insert(&about, 0)?;

    Ok(())
}
