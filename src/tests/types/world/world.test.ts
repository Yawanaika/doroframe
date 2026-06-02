import { describe, it, expect } from 'vitest';
import {worldFromJson, worldToJson} from "@/types/wf-state/world/index.ts";


describe('World', () => {
    const mockWorldData = {
        "WorldSeed": "I4c5e7x1ks5+/zBpIEJaZZRufMqHdafg/5mttxJyBSSb/0ZZs7c8P7DPXzzh56177EDW96lZEkV23Qr0ZZm65Ie5iRolJcIsg4zeQhS4g2jxmY/hyLdC2WzUsGHb5YF0dFzx4sIQ1cSNOx0Y6P4w+duD0lwKmCUf/nl5AjLrFvk=",
        "Version": 10,
        "MobileVersion": "5.3.3.0",
        "BuildLabel": "2026.05.13.13.07/k5jJr3W3pt8Z6zRKrEAl1Q",
        "Time": 1780278423,
        "Events": [
            {
                "_id": {
                    "$oid": "62d31b87106360aa5703954d"
                },
                "Messages": [
                    {
                        "LanguageCode": "en",
                        "Message": "/Lotus/Language/CommunityMessages/JoinDiscord"
                    },
                    {
                        "LanguageCode": "fr",
                        "Message": "/Lotus/Language/CommunityMessages/JoinDiscord"
                    },
                    {
                        "LanguageCode": "it",
                        "Message": "/Lotus/Language/CommunityMessages/JoinDiscord"
                    },
                    {
                        "LanguageCode": "de",
                        "Message": "/Lotus/Language/CommunityMessages/JoinDiscord"
                    },
                    {
                        "LanguageCode": "es",
                        "Message": "/Lotus/Language/CommunityMessages/JoinDiscord"
                    },
                    {
                        "LanguageCode": "pt",
                        "Message": "/Lotus/Language/CommunityMessages/JoinDiscord"
                    },
                    {
                        "LanguageCode": "ru",
                        "Message": "/Lotus/Language/CommunityMessages/JoinDiscord"
                    },
                    {
                        "LanguageCode": "pl",
                        "Message": "/Lotus/Language/CommunityMessages/JoinDiscord"
                    },
                    {
                        "LanguageCode": "uk",
                        "Message": "/Lotus/Language/CommunityMessages/JoinDiscord"
                    },
                    {
                        "LanguageCode": "tr",
                        "Message": "/Lotus/Language/CommunityMessages/JoinDiscord"
                    },
                    {
                        "LanguageCode": "ja",
                        "Message": "/Lotus/Language/CommunityMessages/JoinDiscord"
                    },
                    {
                        "LanguageCode": "zh",
                        "Message": "/Lotus/Language/CommunityMessages/JoinDiscord"
                    },
                    {
                        "LanguageCode": "ko",
                        "Message": "/Lotus/Language/CommunityMessages/JoinDiscord"
                    },
                    {
                        "LanguageCode": "tc",
                        "Message": "/Lotus/Language/CommunityMessages/JoinDiscord"
                    }
                ],
                "Prop": "https://discord.com/invite/playwarframe",
                "Icon": "/Lotus/Interface/Icons/DiscordIconNoBacker.png",
                "Priority": false,
                "MobileOnly": false,
                "Community": true
            },
            {
                "_id": {
                    "$oid": "62dff6238607d6b5d80876f5"
                },
                "Messages": [
                    {
                        "LanguageCode": "fr",
                        "Message": "Une ressource indispensable, le Wiki FR Warframe !"
                    }
                ],
                "Prop": "https://warframe.fandom.com/fr/wiki/Wiki_Warframe",
                "ImageUrl": "https://content.invisioncic.com/Mwarframe/monthly_2022_07/image.png.f54c43d80f7da00887a7c41471884c84.png",
                "Priority": false,
                "MobileOnly": false,
                "Community": true
            },
            {
                "_id": {
                    "$oid": "67ae4e9fca4611344608d246"
                },
                "Messages": [
                    {
                        "LanguageCode": "en",
                        "Message": "Check out the official Warframe Wiki "
                    }
                ],
                "Prop": "https://wiki.warframe.com/",
                "Priority": false,
                "MobileOnly": false,
                "Community": true
            },
            {
                "_id": {
                    "$oid": "6824c85b6c30b5a005004018"
                },
                "Messages": [
                    {
                        "LanguageCode": "en",
                        "Message": "Visit the official Warframe Forums!"
                    }
                ],
                "Prop": "https://forums.warframe.com/",
                "Priority": false,
                "MobileOnly": false,
                "Community": true
            },
            {
                "_id": {
                    "$oid": "682de27153447e81120764d2"
                },
                "Messages": [
                    {
                        "LanguageCode": "tr",
                        "Message": "Epic Games Hesap Bağlama ve Otomatik Giriş"
                    }
                ],
                "Prop": "https://forums.warframe.com/topic/1454865-epic-games-hesap-ba%C4%9Flama-ve-otomatik-giri%C5%9F/",
                "Date": {
                    "$date": {
                        "$numberLong": "1747837440000"
                    }
                },
                "Priority": false,
                "MobileOnly": false,
                "Community": true
            },
            {
                "_id": {
                    "$oid": "6855a1d787107cb1060a5c18"
                },
                "Messages": [
                    {
                        "LanguageCode": "ja",
                        "Message": "公式Blueskyアカウント開設のお知らせ"
                    }
                ],
                "Prop": "http://bit.ly/4ncDPFs",
                "Date": {
                    "$date": {
                        "$numberLong": "1750441980000"
                    }
                },
                "ImageUrl": "https://media.invisioncic.com/Mwarframe/monthly_2021_01/Wiki-background.thumb.jpg.f568775e1b4eab008c7c6d3802c942aa.jpg",
                "Priority": false,
                "MobileOnly": false,
                "Community": true
            },
            {
                "_id": {
                    "$oid": "68ba136bbadfdd82900f8bbe"
                },
                "Messages": [
                    {
                        "LanguageCode": "ja",
                        "Message": "公式Xアカウント開設のお知らせ"
                    }
                ],
                "Prop": "http://bit.ly/4mXYtZB",
                "Date": {
                    "$date": {
                        "$numberLong": "1757025060000"
                    }
                },
                "ImageUrl": "https://media.invisioncic.com/Mwarframe/monthly_2021_01/Wiki-background.thumb.jpg.f568775e1b4eab008c7c6d3802c942aa.jpg",
                "Priority": false,
                "MobileOnly": false,
                "Community": true
            },
            {
                "_id": {
                    "$oid": "693a2f4c00f3d365ea0a0e9d"
                },
                "Messages": [
                    {
                        "LanguageCode": "pt",
                        "Message": "Atualização 42: Artífice das Sombras"
                    }
                ],
                "Prop": "https://forums.warframe.com/topic/1497704-atualiza%C3%A7%C3%A3o-42-art%C3%ADfice-das-sombras/",
                "Date": {
                    "$date": {
                        "$numberLong": "1774450800000"
                    }
                },
                "ImageUrl": "https://www-static.warframe.com/uploads/398576ec427f02d8756fdbc11758722b.png",
                "Priority": false,
                "MobileOnly": false
            },
            {
                "_id": {
                    "$oid": "698cb0268bf154ee5007aabe"
                },
                "Messages": [
                    {
                        "LanguageCode": "pt",
                        "Message": "Diretrizes da Comunidade: Código de Conduta"
                    }
                ],
                "Prop": "https://forums.warframe.com/topic/1492036-diretrizes-da-comunidade-c%C3%B3digo-de-conduta/",
                "Priority": false,
                "MobileOnly": false,
                "Community": true
            },
            {
                "_id": {
                    "$oid": "698cb04081139377cd0eeb32"
                },
                "Messages": [
                    {
                        "LanguageCode": "pt",
                        "Message": "Diretrizes da Comunidade: Uso do Bate-Papo"
                    }
                ],
                "Prop": "https://forums.warframe.com/topic/1492034-diretrizes-da-comunidade-uso-dos-canais-de-bate-papo/",
                "Priority": false,
                "MobileOnly": false,
                "Community": true
            },
            {
                "_id": {
                    "$oid": "698e36fdf79875d410074dbe"
                },
                "Messages": [
                    {
                        "LanguageCode": "pt",
                        "Message": "Voruna Prime: Correção 42.0.11"
                    }
                ],
                "Prop": "https://forums.warframe.com/topic/1506519-voruna-prime-correção-42011/",
                "Date": {
                    "$date": {
                        "$numberLong": "1778699100000"
                    }
                },
                "Priority": false,
                "MobileOnly": false
            },
            {
                "_id": {
                    "$oid": "69c3fb55475245c55b0a633c"
                },
                "Messages": [
                    {
                        "LanguageCode": "en",
                        "Message": "Known Bugs Tracker"
                    }
                ],
                "Prop": "https://forums.warframe.com/topic/1497599-known-issues-the-shadowgrapher/",
                "Date": {
                    "$date": {
                        "$numberLong": "1774451460000"
                    }
                },
                "Priority": false,
                "MobileOnly": false,
                "Community": true
            },
            {
                "_id": {
                    "$oid": "69c40379798250c3910814fb"
                },
                "Messages": [
                    {
                        "LanguageCode": "ko",
                        "Message": "업데이트 42: 그림자 화가"
                    }
                ],
                "Prop": "",
                "Links": [
                    {
                        "LanguageCode": "ko",
                        "Link": "https://forums.warframe.com/topic/1497720-%EC%97%85%EB%8D%B0%EC%9D%B4%ED%8A%B8-42-%EA%B7%B8%EB%A6%BC%EC%9E%90-%ED%99%94%EA%B0%80/"
                    }
                ],
                "Date": {
                    "$date": {
                        "$numberLong": "1774453560000"
                    }
                },
                "Priority": false,
                "MobileOnly": false
            },
            {
                "_id": {
                    "$oid": "69c4440078020fbf830fe00f"
                },
                "Messages": [
                    {
                        "LanguageCode": "es",
                        "Message": " Actualización 42: Grafista de Sombras"
                    }
                ],
                "Prop": "https://forums.warframe.com/topic/1497982-actualizaci%C3%B3n-42-grafista-de-sombras/",
                "Date": {
                    "$date": {
                        "$numberLong": "1774470000000"
                    }
                },
                "Priority": false,
                "MobileOnly": false,
                "Community": true
            },
            {
                "_id": {
                    "$oid": "69eb8206573bbe03e7010425"
                },
                "Messages": [
                    {
                        "LanguageCode": "en",
                        "Message": "Official Community Updates Page! "
                    }
                ],
                "Prop": "https://wrfr.me/48p5oWC",
                "Date": {
                    "$date": {
                        "$numberLong": "1777041660000"
                    }
                },
                "Priority": true,
                "MobileOnly": false,
                "Community": true
            },
            {
                "_id": {
                    "$oid": "69f8b90d1503bd09490e40db"
                },
                "Messages": [
                    {
                        "LanguageCode": "en",
                        "Message": "The TennoCon 2026 Digital Pack is available now!"
                    },
                    {
                        "LanguageCode": "fr",
                        "Message": "Le Pack Digital TennoCon 2026 est disponible dès maintenant !"
                    },
                    {
                        "LanguageCode": "it",
                        "Message": "Il Pacchetto Digitale TennoCon 2026 è ora disponibile!"
                    },
                    {
                        "LanguageCode": "de",
                        "Message": "Das TennoCon 2026 Digital-Paket ist bald verfügbar!"
                    },
                    {
                        "LanguageCode": "es",
                        "Message": "¡El Paquete Digital de TennoCon 2026 ya está disponible!"
                    },
                    {
                        "LanguageCode": "pt",
                        "Message": "O Pacote Digital da TennoCon 2026 já está disponível!"
                    },
                    {
                        "LanguageCode": "ru",
                        "Message": "Цифровой набор TennoCon 2026 уже доступен!"
                    },
                    {
                        "LanguageCode": "pl",
                        "Message": "Pakiet Cyfrowy TennoCon 2026 jest już dostępny!"
                    },
                    {
                        "LanguageCode": "uk",
                        "Message": "Цифровий набір «Теннокон 2026» уже доступний!"
                    },
                    {
                        "LanguageCode": "tr",
                        "Message": "TennoCon 2026 Dijital Paketi şimdi satışta!"
                    },
                    {
                        "LanguageCode": "ja",
                        "Message": "TennoCon 2026 デジタルパックが販売開始"
                    },
                    {
                        "LanguageCode": "zh",
                        "Message": "TennoCon 2026 虚拟礼包现已上线！"
                    },
                    {
                        "LanguageCode": "ko",
                        "Message": "TennoCon 2026 디지털 팩이 지금 출시되었습니다!"
                    },
                    {
                        "LanguageCode": "tc",
                        "Message": "TennoCon 2026 數位包現已登場！"
                    },
                    {
                        "LanguageCode": "th",
                        "Message": "ดิจิทัลแพ็ก TennoCon 2026 วางจำหน่ายแล้ว!"
                    }
                ],
                "Prop": "https://www.warframe.com/news/tennocon-2026-digital-pack-and-merch-pack-available-now?utm_medium=in-game&utm_source=in-game&utm_campaign=2026-05-TennoConDigitalMerchPackLaunch",
                "Date": {
                    "$date": {
                        "$numberLong": "1777906800000"
                    }
                },
                "ImageUrl": "https://www-static.warframe.com/uploads/20a0a4d20b9ad238c5a5840b97741860.png",
                "Priority": false,
                "MobileOnly": false
            },
            {
                "_id": {
                    "$oid": "69f8beb89df2961fff00a705"
                },
                "Messages": [
                    {
                        "LanguageCode": "en",
                        "Message": "The TennoCon 2026 Merch Pack is now available!"
                    },
                    {
                        "LanguageCode": "fr",
                        "Message": "Le Pack de Produits Dérivés de la TennoCon 2026 est maintenant disponible !"
                    },
                    {
                        "LanguageCode": "it",
                        "Message": "Il Pacchetto Merch TennoCon 2026 è ora disponibile!"
                    },
                    {
                        "LanguageCode": "de",
                        "Message": "Das TennoCon 2026 Merch-Paket ist jetzt verfügbar!"
                    },
                    {
                        "LanguageCode": "es",
                        "Message": "¡El Paquete de Productos de TennoCon 2026 ya está disponible!"
                    },
                    {
                        "LanguageCode": "pt",
                        "Message": "O Pacote de Produtos da TennoCon 2026 já está disponível!"
                    },
                    {
                        "LanguageCode": "ru",
                        "Message": "Набор Товаров TennoCon 2026 уже в продаже!"
                    },
                    {
                        "LanguageCode": "pl",
                        "Message": "Pakiet Gadżetów TennoCon 2026 jest już dostępny!"
                    },
                    {
                        "LanguageCode": "uk",
                        "Message": "Набір рекламних товарів «Теннокон 2026» уже доступний!"
                    },
                    {
                        "LanguageCode": "tr",
                        "Message": "TennoCon 2026 Ürün Paketi artık satışta!"
                    },
                    {
                        "LanguageCode": "ja",
                        "Message": "TennoCon 2026 グッズパックが販売開始"
                    },
                    {
                        "LanguageCode": "zh",
                        "Message": "TennoCon 2026 周边商品组合包现已上线！"
                    },
                    {
                        "LanguageCode": "ko",
                        "Message": "TennoCon 2026 굿즈 팩이 출시되었습니다!"
                    },
                    {
                        "LanguageCode": "tc",
                        "Message": "TennoCon 2026 周邊商品組合包現已登場！"
                    },
                    {
                        "LanguageCode": "th",
                        "Message": "แพ็ก TennoCon 2026 Merch วางจำหน่ายแล้ว!"
                    }
                ],
                "Prop": "https://store.warframe.com/products/tennocon-2026-merch-pack?utm_medium=in-game&utm_source=in-game&utm_campaign=2026-05-TennoConMerchPackLaunch",
                "Date": {
                    "$date": {
                        "$numberLong": "1777908600000"
                    }
                },
                "ImageUrl": "https://www-static.warframe.com/uploads/ac04ed3a123ad1849bdf2ba0b0f3d3bd.jpg",
                "Priority": false,
                "MobileOnly": false
            },
            {
                "_id": {
                    "$oid": "69f8d5e53d0eaa18fe082b81"
                },
                "Messages": [
                    {
                        "LanguageCode": "pl",
                        "Message": "Operacja: W Jamie Bestii "
                    }
                ],
                "Prop": "https://forums.warframe.com/topic/1505418-operacja-w-jamie-bestii/",
                "Date": {
                    "$date": {
                        "$numberLong": "1777914780000"
                    }
                },
                "EventEndDate": {
                    "$date": {
                        "$numberLong": "1780286400000"
                    }
                },
                "ImageUrl": "https://media.invisioncic.com/Mwarframe/monthly_2025_02/image.png.cadcf17777d55b3ed92e7bd682cb631f.png",
                "Priority": false,
                "MobileOnly": false,
                "HideEndDateModifier": true
            },
            {
                "_id": {
                    "$oid": "6a036fea6c74c2d234052d3a"
                },
                "Messages": [
                    {
                        "LanguageCode": "ja",
                        "Message": "Devstream 第196回のお知らせ"
                    }
                ],
                "Prop": "https://bit.ly/4u0f9Dg",
                "Date": {
                    "$date": {
                        "$numberLong": "1778610060000"
                    }
                },
                "EventStartDate": {
                    "$date": {
                        "$numberLong": "1780084800000"
                    }
                },
                "ImageUrl": "https://www-static.warframe.com/uploads/721efad4a3f3c10dfcd7e2cb7b0525a5.jpg",
                "Priority": false,
                "MobileOnly": false,
                "Community": true,
                "HideEndDateModifier": true
            },
            {
                "_id": {
                    "$oid": "6a03715d28f92f39880d3404"
                },
                "Messages": [
                    {
                        "LanguageCode": "fr",
                        "Message": "Prochainement : Devstream 196 - Sirius & Orion"
                    }
                ],
                "Prop": "https://forums.warframe.com/topic/1506391-prochainement-devstream-196-sirius-orion/",
                "Date": {
                    "$date": {
                        "$numberLong": "1778610300000"
                    }
                },
                "ImageUrl": "https://www-static.warframe.com/uploads/721efad4a3f3c10dfcd7e2cb7b0525a5.jpg",
                "Priority": false,
                "MobileOnly": false
            },
            {
                "_id": {
                    "$oid": "6a04ca4ce1d4c7dbc400814c"
                },
                "Messages": [
                    {
                        "LanguageCode": "en",
                        "Message": "Voruna Prime: Hotfix 42.0.11"
                    }
                ],
                "Prop": "https://www.warframe.com/en/patch-notes/pc/42-0-11",
                "Date": {
                    "$date": {
                        "$numberLong": "1778698800000"
                    }
                },
                "Priority": false,
                "MobileOnly": false
            },
            {
                "_id": {
                    "$oid": "6a04cb3ae1d4c7dbc400817d"
                },
                "Messages": [
                    {
                        "LanguageCode": "fr",
                        "Message": "Voruna Prime : Correctif 42.0.11 "
                    }
                ],
                "Prop": "https://forums.warframe.com/topic/1506509-voruna-prime-correctif-42011/",
                "Date": {
                    "$date": {
                        "$numberLong": "1778699040000"
                    }
                },
                "Priority": false,
                "MobileOnly": false
            },
            {
                "_id": {
                    "$oid": "6a07409184b12a1d8a0baaf4"
                },
                "Messages": [
                    {
                        "LanguageCode": "fr",
                        "Message": "Problèmes connus [L'Ombromane] (15 mai)"
                    }
                ],
                "Prop": "https://forums.warframe.com/topic/1497900-probl%C3%A8mes-connus-lombromane-15-mai/",
                "Date": {
                    "$date": {
                        "$numberLong": "1778860020000"
                    }
                },
                "ImageUrl": "https://www-static.warframe.com/uploads/thumbnails/a979b2d114ccb05a2a7e17f4ee6ceb3f_1600x900.png",
                "Priority": false,
                "MobileOnly": false
            },
            {
                "_id": {
                    "$oid": "6a0cc8289f30cba06f070435"
                },
                "Messages": [
                    {
                        "LanguageCode": "fr",
                        "Message": "[PSA] Pause des correctifs jusqu'à Constellations "
                    }
                ],
                "Prop": "https://forums.warframe.com/topic/1507036-psa-pause-des-correctifs-jusqu%C3%A0-constellations/",
                "Date": {
                    "$date": {
                        "$numberLong": "1779222480000"
                    }
                },
                "ImageUrl": "https://media.invisioncic.com/Mwarframe/monthly_2026_05/JSC.png.2091c12d766496e9468eeb84ab3565a1.png",
                "Priority": false,
                "MobileOnly": false
            },
            {
                "_id": {
                    "$oid": "6a14ab3c1ee5b35dac009a2e"
                },
                "Messages": [
                    {
                        "LanguageCode": "fr",
                        "Message": "Streams & Drops : 25 - 31 mai"
                    }
                ],
                "Prop": "https://forums.warframe.com/topic/1507611-streams-communautaires-25-31-mai/",
                "Date": {
                    "$date": {
                        "$numberLong": "1779739380000"
                    }
                },
                "EventStartDate": {
                    "$date": {
                        "$numberLong": "1779681600000"
                    }
                },
                "EventEndDate": {
                    "$date": {
                        "$numberLong": "1780293600000"
                    }
                },
                "ImageUrl": "https://media.invisioncic.com/Mwarframe/monthly_2026_05/PT484_Drops.jpg.86632a90ef174f5f036bd13431775f22.jpg",
                "Priority": false,
                "MobileOnly": false,
                "HideEndDateModifier": true
            },
            {
                "_id": {
                    "$oid": "6a15f6c2f7acf9239601c952"
                },
                "Messages": [
                    {
                        "LanguageCode": "en",
                        "Message": "Operation: Belly of the Beast Ends June 1"
                    },
                    {
                        "LanguageCode": "fr",
                        "Message": "L'Opération : Ventre de la Bête se termine le 1er juin"
                    },
                    {
                        "LanguageCode": "it",
                        "Message": "Operazione: Belly of the Beast termina il 1° Giugno"
                    },
                    {
                        "LanguageCode": "de",
                        "Message": "Operation: Das Innere der Bestie endet am 1. Juni"
                    },
                    {
                        "LanguageCode": "es",
                        "Message": "La «Operación: Vientre de la Bestia» termina el 1 de junio"
                    },
                    {
                        "LanguageCode": "pt",
                        "Message": "A Operação Ventre da Besta terminará no dia 1º de junho"
                    },
                    {
                        "LanguageCode": "ru",
                        "Message": "«Операция: Чрево зверя» завершится 1 июня."
                    },
                    {
                        "LanguageCode": "pl",
                        "Message": "Operacja: W Jamie Bestii kończy się 1 czerwca"
                    },
                    {
                        "LanguageCode": "uk",
                        "Message": "Операція «У лігві звіра» завершиться 1 червня"
                    },
                    {
                        "LanguageCode": "tr",
                        "Message": "Operasyon: Canavarın Göbeği, 1 Haziran'da sona eriyor"
                    },
                    {
                        "LanguageCode": "ja",
                        "Message": "「獣の巣窟」作戦が6月2日に終了"
                    },
                    {
                        "LanguageCode": "zh",
                        "Message": "《行动代号：兽之腹》将于美东夏令时间 6 月 1 日结束"
                    },
                    {
                        "LanguageCode": "ko",
                        "Message": "작전명: 짐승의 뱃속이 북미 시각 6월 1일 종료됩니다"
                    },
                    {
                        "LanguageCode": "tc",
                        "Message": "《行動代號：野獸之腹》於 6 月 1 日結束"
                    },
                    {
                        "LanguageCode": "th",
                        "Message": "ปฏิบัติการ: Belly of the Beast จะสิ้นสุดในวันที่ 1 มิถุนายน"
                    }
                ],
                "Prop": "https://www.warframe.com/news/operation-belly-of-the-beast-returns?utm_medium=in-game&utm_source=in-game&utm_campaign=2026-05-BellyoftheBeastEndingSoon",
                "Date": {
                    "$date": {
                        "$numberLong": "1779823920000"
                    }
                },
                "EventEndDate": {
                    "$date": {
                        "$numberLong": "1780336740000"
                    }
                },
                "ImageUrl": "https://www-static.warframe.com/uploads/thumbnails/4a26dc77b04500931c2e6c27fef8bafc_1600x900.png",
                "Priority": false,
                "MobileOnly": false,
                "HideEndDateModifier": true
            },
            {
                "_id": {
                    "$oid": "6a18856b90576da21c024ff6"
                },
                "Messages": [
                    {
                        "LanguageCode": "en",
                        "Message": "Pride 2026"
                    },
                    {
                        "LanguageCode": "fr",
                        "Message": "Fierté 2026"
                    },
                    {
                        "LanguageCode": "it",
                        "Message": "Pride 2026"
                    },
                    {
                        "LanguageCode": "de",
                        "Message": "Pride 2026"
                    },
                    {
                        "LanguageCode": "es",
                        "Message": "Orgullo 2026"
                    },
                    {
                        "LanguageCode": "pt",
                        "Message": "Orgulho LGBTQIAPN+ 2026"
                    },
                    {
                        "LanguageCode": "ru",
                        "Message": "Прайд 2026"
                    },
                    {
                        "LanguageCode": "pl",
                        "Message": "Duma 2026"
                    },
                    {
                        "LanguageCode": "uk",
                        "Message": "Прайд 2026"
                    },
                    {
                        "LanguageCode": "tr",
                        "Message": "Pride 2026"
                    },
                    {
                        "LanguageCode": "ja",
                        "Message": "プライド 2026"
                    },
                    {
                        "LanguageCode": "zh",
                        "Message": "骄傲月 2026"
                    },
                    {
                        "LanguageCode": "ko",
                        "Message": "성소수자의 달 2026"
                    },
                    {
                        "LanguageCode": "tc",
                        "Message": "同志驕傲 2026"
                    },
                    {
                        "LanguageCode": "th",
                        "Message": "Pride 2026"
                    }
                ],
                "Prop": "https://www.warframe.com/en/news/pride-2026?utm_medium=in-game&utm_source=in-game&utm_campaign=2026-Pride2026Launch",
                "Date": {
                    "$date": {
                        "$numberLong": "1779991200000"
                    }
                },
                "EventEndDate": {
                    "$date": {
                        "$numberLong": "1782889140000"
                    }
                },
                "ImageUrl": "https://www-static.warframe.com/uploads/67eed269f2bd82cc885f3fdac0cc89c8.png",
                "Priority": false,
                "MobileOnly": false
            },
            {
                "_id": {
                    "$oid": "6a18912be00aa893470e975e"
                },
                "Messages": [
                    {
                        "LanguageCode": "en",
                        "Message": "Makeship Kaithe Plush Available Now"
                    },
                    {
                        "LanguageCode": "fr",
                        "Message": "Peluche Kaithe de Makeship maintenant disponible"
                    },
                    {
                        "LanguageCode": "it",
                        "Message": "Il Peluche Kaithe di Makeship è ora disponibile."
                    },
                    {
                        "LanguageCode": "de",
                        "Message": "Makeship Plüschtier: Kaithe jetzt erhältlich"
                    },
                    {
                        "LanguageCode": "es",
                        "Message": "El peluche de kaithe de Makeship ya está disponible"
                    },
                    {
                        "LanguageCode": "pt",
                        "Message": "A Pelúcia do Kaithe da Makeship já está disponível"
                    },
                    {
                        "LanguageCode": "ru",
                        "Message": "Плюшевый Кайт из Makeship уже доступен"
                    },
                    {
                        "LanguageCode": "pl",
                        "Message": "Pluszak Kaithe od Makeship już dostępny"
                    },
                    {
                        "LanguageCode": "uk",
                        "Message": "Плюш «Кайт» від Makeship уже доступний"
                    },
                    {
                        "LanguageCode": "tr",
                        "Message": "Makeship Kaithe Peluş Şimdi Sizlerle"
                    },
                    {
                        "LanguageCode": "ja",
                        "Message": "Makeship ケイスのぬいぐるみが登場"
                    },
                    {
                        "LanguageCode": "zh",
                        "Message": "Makeship 绝灵骥毛绒玩偶现已发售"
                    },
                    {
                        "LanguageCode": "ko",
                        "Message": "Makeship 케이스 봉제인형을 지금 만나보세요"
                    },
                    {
                        "LanguageCode": "tc",
                        "Message": "Makeship 凱駿絨毛玩偶現已登場"
                    },
                    {
                        "LanguageCode": "th",
                        "Message": "ตุ๊กตา Kaithe จาก Makeship วางจำหน่ายแล้ว"
                    }
                ],
                "Prop": "https://www.warframe.com/en/news/makeship-kaithe-plush-available-now?utm_medium=in-game&utm_source=in-game",
                "Date": {
                    "$date": {
                        "$numberLong": "1779994800000"
                    }
                },
                "ImageUrl": "https://www-static.warframe.com/uploads/2c3401e9674e7936e771dd4619ac93a2.png",
                "Priority": false,
                "MobileOnly": false
            },
            {
                "_id": {
                    "$oid": "6a19d5cd1cebf654d302b7b7"
                },
                "Messages": [
                    {
                        "LanguageCode": "en",
                        "Message": "Coming Soon: ARK/8 x Warframe Pop-Up"
                    },
                    {
                        "LanguageCode": "es",
                        "Message": "Próximamente: ARK/8 x Warframe Pop-Up"
                    }
                ],
                "Prop": "https://www.warframe.com/en/news/ark8-x-warframe-pop-up?utm_medium=in-game&utm_source=in-game&utm_campaign=2026-Ark8ComingSoonCollab",
                "Date": {
                    "$date": {
                        "$numberLong": "1780077600000"
                    }
                },
                "EventEndDate": {
                    "$date": {
                        "$numberLong": "1780642740000"
                    }
                },
                "ImageUrl": "https://www-static.warframe.com/uploads/a2feca893dd37ee5fcfe8c3e5373f9a0.png",
                "Priority": false,
                "MobileOnly": false
            },
            {
                "_id": {
                    "$oid": "6a19e067506a51ccc707ec5d"
                },
                "Messages": [
                    {
                        "LanguageCode": "en",
                        "Message": "Jade Shadows: Constellations Coming June 17"
                    },
                    {
                        "LanguageCode": "fr",
                        "Message": "Les Ombres de Jade : Constellations - À venir le 17 juin"
                    },
                    {
                        "LanguageCode": "it",
                        "Message": "Ombre di Jade: Costellazioni in arrivo il 17 Giugno"
                    },
                    {
                        "LanguageCode": "de",
                        "Message": "Jade-Schatten: Konstellationen erscheint am 17. Juni"
                    },
                    {
                        "LanguageCode": "es",
                        "Message": "«Sombras de Jade: Constelaciones» llega el 17 de junio"
                    },
                    {
                        "LanguageCode": "pt",
                        "Message": "Sombras da Jade: Constelações chegará no dia 17 de junho"
                    },
                    {
                        "LanguageCode": "ru",
                        "Message": "«Нефритовые Тени: Созвездия» выйдут 17 июня"
                    },
                    {
                        "LanguageCode": "pl",
                        "Message": "Jadeitowe Cienie: Konstelacje pojawią się 17 czerwca"
                    },
                    {
                        "LanguageCode": "uk",
                        "Message": "«Нефритові тіні: Сузір’я» з’являться 17 червня"
                    },
                    {
                        "LanguageCode": "tr",
                        "Message": "Jade Shadows: Constellations - 17 Haziran'da Sizlerle"
                    },
                    {
                        "LanguageCode": "ja",
                        "Message": "「翡翠の影：星座」6月18日登場"
                    },
                    {
                        "LanguageCode": "zh",
                        "Message": "《Jade 之影：众星》将于美东夏令时间 6 月 17 日上线"
                    },
                    {
                        "LanguageCode": "ko",
                        "Message": "옥빛의 그림자: 성좌들이 북미 시각 6월 17일 출시됩니다"
                    },
                    {
                        "LanguageCode": "tc",
                        "Message": "《翠玉遺影：星宿》於 6 月 17 日登場"
                    },
                    {
                        "LanguageCode": "th",
                        "Message": "Jade Shadows: กลุ่มดาว จะมาในวันที่ 17 มิถุนายนนี้"
                    }
                ],
                "Prop": "https://www.warframe.com/jade-shadows-constellations?utm_medium=in-game&utm_source=in-game&utm_campaign=2026-JadeShadowsConstellationsDateAnnounce",
                "Date": {
                    "$date": {
                        "$numberLong": "1780080600000"
                    }
                },
                "ImageUrl": "https://www-static.warframe.com/uploads/603ed00d80463c12dd6665cb82d3d11b.png",
                "Priority": false,
                "MobileOnly": false
            },
            {
                "_id": {
                    "$oid": "6a19e0d3506a51ccc707ed03"
                },
                "Messages": [
                    {
                        "LanguageCode": "en",
                        "Message": "Styanax Prime Access Coming June 17"
                    },
                    {
                        "LanguageCode": "fr",
                        "Message": "Le Prime Access Styanax Prime arrive le 17 juin"
                    },
                    {
                        "LanguageCode": "it",
                        "Message": "L'Accesso Styanax Prime Arriva il 17 Giugno"
                    },
                    {
                        "LanguageCode": "de",
                        "Message": "Styanax Prime Access erscheint am 17. Juni"
                    },
                    {
                        "LanguageCode": "es",
                        "Message": "Prime Access de Styanax disponible el 17 de junio"
                    },
                    {
                        "LanguageCode": "pt",
                        "Message": "O Prime Access do Styanax Prime estará disponível no dia 17 de junho"
                    },
                    {
                        "LanguageCode": "ru",
                        "Message": "Доступ Стинакса Прайм открывается 17 июня"
                    },
                    {
                        "LanguageCode": "pl",
                        "Message": "Styanax Prime Access nadchodzi już 17 czerwca"
                    },
                    {
                        "LanguageCode": "uk",
                        "Message": "Доступ до Стейнекса-прайм відкривається 17 червня"
                    },
                    {
                        "LanguageCode": "tr",
                        "Message": "Styanax Prime Access 17 Haziran'da Geliyor"
                    },
                    {
                        "LanguageCode": "ja",
                        "Message": "Styanax Prime Access、6月18日登場"
                    },
                    {
                        "LanguageCode": "zh",
                        "Message": "Styanax Prime Access 将于美东夏令时间 6 月 17 日登场"
                    },
                    {
                        "LanguageCode": "ko",
                        "Message": "스티아낙스 프라임이 북미 시각 6월 17일에 출시됩니다"
                    },
                    {
                        "LanguageCode": "tc",
                        "Message": "Styanax Prime Access 於 6 月 17 日登場"
                    },
                    {
                        "LanguageCode": "th",
                        "Message": "Styanax Prime Access จะมาในวันที่ 17 มิถุนายนนี้"
                    }
                ],
                "Prop": "https://www.warframe.com/news/styanax-prime-access?utm_medium=in-game&utm_source=in-game&utm_campaign=2026-StyanaxPrimeAccessAnnounce",
                "Date": {
                    "$date": {
                        "$numberLong": "1780080300000"
                    }
                },
                "ImageUrl": "https://www-static.warframe.com/uploads/48421377826cf2022df220e9bca363b8.png",
                "Priority": false,
                "MobileOnly": false
            },
            {
                "_id": {
                    "$oid": "6a19e13279c70e17be0247aa"
                },
                "Messages": [
                    {
                        "LanguageCode": "es",
                        "Message": "Sombras de Jade: Constelaciones - Taller de desarrollo sobre mejoras en la calidad de vida"
                    }
                ],
                "Prop": "https://forums.warframe.com/topic/1507937-sombras-de-jade-constelaciones-taller-de-desarrollo-sobre-mejoras-en-la-calidad-de-vida/",
                "Date": {
                    "$date": {
                        "$numberLong": "1780080780000"
                    }
                },
                "EventEndDate": {
                    "$date": {
                        "$numberLong": "1781672340000"
                    }
                },
                "Priority": false,
                "MobileOnly": false,
                "Community": true,
                "HideEndDateModifier": true
            },
            {
                "_id": {
                    "$oid": "6a19e3da82c7e9aae7056f2b"
                },
                "Messages": [
                    {
                        "LanguageCode": "fr",
                        "Message": "[Atelier des Devs] Constellations – QOL "
                    }
                ],
                "Prop": "https://forums.warframe.com/topic/1507942-atelier-des-devs-constellations-%E2%80%93-qol/",
                "Date": {
                    "$date": {
                        "$numberLong": "1780081500000"
                    }
                },
                "Priority": false,
                "MobileOnly": false
            }
        ],
        "Goals": [
            {
                "_id": {
                    "$oid": "69f8dea00000000000000000"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1777917600000"
                    }
                },
                "Community": true,
                "ClanGoal": [
                    72,
                    216,
                    648,
                    1944,
                    5832
                ],
                "Count": 100,
                "Desc": "/Lotus/Language/JadeShadows/JadeShadowsEventName",
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780336800000"
                    }
                },
                "GracePeriod": {
                    "$date": {
                        "$numberLong": "1780941600000"
                    }
                },
                "Faction": "FC_MITW",
                "Goal": 0,
                "HealthPct": 1,
                "Icon": "/Lotus/Interface/Icons/WorldStatePanel/JadeShadowsEventBadge.png",
                "ScoreLocTag": "/Lotus/Language/JadeShadows/JadeShadowsEventScore",
                "Tag": "JadeShadowsEvent",
                "ToolTip": "/Lotus/Language/JadeShadows/JadeShadowsShortEventDesc",
                "MissionKeyName": "/Lotus/Types/Keys/JadeShadowsEventMission",
                "Node": "SolNode723",
                "Personal": true,
                "ItemType": "/Lotus/Types/Gameplay/JadeShadows/Resources/AscensionEventResourceItem"
            }
        ],
        "Alerts": [
            {
                "_id": {
                    "$oid": "69efcaf5f2da8dc1bb2299f0"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780273800000"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780279200000"
                    }
                },
                "MissionInfo": {
                    "missionType": "MT_MOBILE_DEFENSE",
                    "faction": "FC_INFESTATION",
                    "location": "SolNode706",
                    "levelOverride": "/Lotus/Levels/Proc/Orokin/OrokinTowerDerelictMobileDefense",
                    "enemySpec": "/Lotus/Types/Game/EnemySpecs/InfestedSquadD",
                    "minEnemyLevel": 50,
                    "maxEnemyLevel": 50,
                    "difficulty": 1,
                    "seed": 143589,
                    "missionReward": {
                        "credits": 17000,
                        "countedItems": [
                            {
                                "ItemType": "/Lotus/Types/Gameplay/JadeShadows/Resources/AscensionEventResourceItem",
                                "ItemCount": 10
                            }
                        ]
                    },
                    "descText": "/Lotus/Language/JadeShadows/EventAlertTitle",
                    "questReq": "/Lotus/Types/Keys/JadeShadows/JadeShadowQuestKeyChain",
                    "leadersAlwaysAllowed": true
                },
                "Tag": "JadeShadows",
                "Icon": "/Lotus/Interface/Icons/WorldStatePanel/JadeShadowsEventBadge.png"
            },
            {
                "_id": {
                    "$oid": "69efcaf5f2da8dc1bb2299f2"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780275600000"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780281000000"
                    }
                },
                "MissionInfo": {
                    "missionType": "MT_EXTERMINATION",
                    "faction": "FC_GRINEER",
                    "location": "SolNode181",
                    "levelOverride": "/Lotus/Levels/Proc/Grineer/GrineerAsteroidExterminate",
                    "enemySpec": "/Lotus/Types/Game/EnemySpecs/GrineerExterminateTech",
                    "minEnemyLevel": 50,
                    "maxEnemyLevel": 50,
                    "difficulty": 1,
                    "seed": 223819,
                    "missionReward": {
                        "credits": 17000,
                        "countedItems": [
                            {
                                "ItemType": "/Lotus/Types/Gameplay/JadeShadows/Resources/AscensionEventResourceItem",
                                "ItemCount": 10
                            }
                        ]
                    },
                    "descText": "/Lotus/Language/JadeShadows/EventAlertTitle",
                    "questReq": "/Lotus/Types/Keys/JadeShadows/JadeShadowQuestKeyChain",
                    "leadersAlwaysAllowed": true
                },
                "Tag": "JadeShadows",
                "Icon": "/Lotus/Interface/Icons/WorldStatePanel/JadeShadowsEventBadge.png"
            },
            {
                "_id": {
                    "$oid": "69efcaf5f2da8dc1bb2299f4"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780277400000"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780282800000"
                    }
                },
                "MissionInfo": {
                    "missionType": "MT_TERRITORY",
                    "faction": "FC_GRINEER",
                    "location": "SolNode93",
                    "levelOverride": "/Lotus/Levels/Proc/Grineer/GrineerAsteroidInterception",
                    "enemySpec": "/Lotus/Types/Game/EnemySpecs/GrineerDefenseA",
                    "minEnemyLevel": 50,
                    "maxEnemyLevel": 50,
                    "difficulty": 1,
                    "seed": 22755,
                    "maxWaveNum": 2,
                    "missionReward": {
                        "credits": 17000,
                        "countedItems": [
                            {
                                "ItemType": "/Lotus/Types/Gameplay/JadeShadows/Resources/AscensionEventResourceItem",
                                "ItemCount": 10
                            }
                        ]
                    },
                    "descText": "/Lotus/Language/JadeShadows/EventAlertTitle",
                    "questReq": "/Lotus/Types/Keys/JadeShadows/JadeShadowQuestKeyChain",
                    "leadersAlwaysAllowed": true
                },
                "Tag": "JadeShadows",
                "Icon": "/Lotus/Interface/Icons/WorldStatePanel/JadeShadowsEventBadge.png"
            }
        ],
        "Sorties": [
            {
                "_id": {
                    "$oid": "6a1c577e17ccce06128ce5b1"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243200000"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329600000"
                    }
                },
                "Reward": "/Lotus/Types/Game/MissionDecks/SortieRewards",
                "Seed": 39337,
                "Boss": "SORTIE_BOSS_INFALAD",
                "ExtraDrops": [],
                "Variants": [
                    {
                        "missionType": "MT_INTEL",
                        "modifierType": "SORTIE_MODIFIER_SLASH",
                        "node": "SolNode167",
                        "tileset": "CorpusIcePlanetTilesetCaves"
                    },
                    {
                        "missionType": "MT_RESCUE",
                        "modifierType": "SORTIE_MODIFIER_LOW_ENERGY",
                        "node": "SolNode73",
                        "tileset": "CorpusGasCityTileset"
                    },
                    {
                        "missionType": "MT_MOBILE_DEFENSE",
                        "modifierType": "SORTIE_MODIFIER_EXIMUS",
                        "node": "SolNode19",
                        "tileset": "GrineerAsteroidTileset"
                    }
                ],
                "Twitter": true
            }
        ],
        "LiteSorties": [
            {
                "_id": {
                    "$oid": "6a1cc7ff20e0f7f72a8ce5b1"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780272000000"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780876800000"
                    }
                },
                "Reward": "/Lotus/Types/Game/MissionDecks/ArchonSortieRewards",
                "Seed": 39337,
                "Boss": "SORTIE_BOSS_NIRA",
                "Missions": [
                    {
                        "missionType": "MT_INTEL",
                        "node": "SolNode74"
                    },
                    {
                        "missionType": "MT_TERRITORY",
                        "node": "SolNode100"
                    },
                    {
                        "missionType": "MT_ASSASSINATION",
                        "node": "SolNode53"
                    }
                ]
            }
        ],
        "SyndicateMissions": [
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5b1"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "ArbitersSyndicate",
                "Seed": 39337,
                "Nodes": [
                    "SolNode45",
                    "SolNode223",
                    "SolNode100",
                    "SolNode135",
                    "SolNode6",
                    "SolNode203",
                    "SolNode407"
                ]
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5b3"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "NecraloidSyndicate",
                "Seed": 19520,
                "Nodes": []
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5b4"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "EventSyndicate",
                "Seed": 75631,
                "Nodes": []
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5b2"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "CephalonSudaSyndicate",
                "Seed": 3156,
                "Nodes": [
                    "SolNode15",
                    "SolNode2",
                    "SolNode41",
                    "SolNode132",
                    "SolNode76",
                    "SolNode224",
                    "SolNode64"
                ]
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5b5"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "KahlSyndicate",
                "Seed": 69063,
                "Nodes": []
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5b6"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "NewLokaSyndicate",
                "Seed": 75431,
                "Nodes": [
                    "SolNode103",
                    "SolNode59",
                    "SolNode82",
                    "SolNode706",
                    "SolNode49",
                    "SolNode401",
                    "SolNode97"
                ]
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5b7"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "NightcapJournalSyndicate",
                "Seed": 9852,
                "Nodes": []
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5b8"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "QuillsSyndicate",
                "Seed": 51611,
                "Nodes": []
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5b9"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "PerrinSyndicate",
                "Seed": 58469,
                "Nodes": [
                    "SolNode61",
                    "SolNode79",
                    "SolNode50",
                    "SolNode36",
                    "SolNode139",
                    "SolNode126",
                    "SolNode62"
                ]
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5bc"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "RadioLegionIntermission10Syndicate",
                "Seed": 19258,
                "Nodes": []
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5ba"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "RadioLegion2Syndicate",
                "Seed": 33553,
                "Nodes": []
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5bd"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "RadioLegionIntermission11Syndicate",
                "Seed": 39541,
                "Nodes": []
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5bb"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "RadioLegion3Syndicate",
                "Seed": 91850,
                "Nodes": []
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5c0"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "RadioLegionIntermission14Syndicate",
                "Seed": 73076,
                "Nodes": []
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5be"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "RadioLegionIntermission12Syndicate",
                "Seed": 94984,
                "Nodes": []
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5c1"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "RadioLegionIntermission15Syndicate",
                "Seed": 6220,
                "Nodes": []
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5bf"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "RadioLegionIntermission13Syndicate",
                "Seed": 68611,
                "Nodes": []
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5c4"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "RadioLegionIntermission4Syndicate",
                "Seed": 67224,
                "Nodes": []
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5c2"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "RadioLegionIntermission2Syndicate",
                "Seed": 73288,
                "Nodes": []
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5c6"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "RadioLegionIntermission6Syndicate",
                "Seed": 89452,
                "Nodes": []
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5c5"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "RadioLegionIntermission5Syndicate",
                "Seed": 74956,
                "Nodes": []
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5c3"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "RadioLegionIntermission3Syndicate",
                "Seed": 75825,
                "Nodes": []
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5ca"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "RadioLegionIntermissionSyndicate",
                "Seed": 5206,
                "Nodes": []
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5c7"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "RadioLegionIntermission7Syndicate",
                "Seed": 19664,
                "Nodes": []
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5c8"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "RadioLegionIntermission8Syndicate",
                "Seed": 15282,
                "Nodes": []
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5c9"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "RadioLegionIntermission9Syndicate",
                "Seed": 55627,
                "Nodes": []
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5cb"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "RadioLegionSyndicate",
                "Seed": 35931,
                "Nodes": []
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5cc"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "RedVeilSyndicate",
                "Seed": 16014,
                "Nodes": [
                    "SolNode75",
                    "SolNode226",
                    "SolNode146",
                    "SettlementNode14",
                    "SolNode175",
                    "SolNode137",
                    "SolNode184"
                ]
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5ce"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "VoxSyndicate",
                "Seed": 46926,
                "Nodes": []
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5cd"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "VentKidsSyndicate",
                "Seed": 89477,
                "Nodes": []
            },
            {
                "_id": {
                    "$oid": "6a1c5ac7b01b3f78d18ce5cf"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780243143018"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780329540000"
                    }
                },
                "Tag": "SteelMeridianSyndicate",
                "Seed": 79966,
                "Nodes": [
                    "SolNode113",
                    "SolNode225",
                    "SolNode147",
                    "SolNode708",
                    "SolNode188",
                    "SettlementNode15",
                    "SolNode17"
                ]
            },
            {
                "_id": {
                    "$oid": "6a1cdb830000000000000002"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780276099727"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780285098601"
                    }
                },
                "Tag": "EntratiSyndicate",
                "Seed": 41421,
                "Nodes": [],
                "Jobs": [
                    {
                        "jobType": "/Lotus/Types/Gameplay/InfestedMicroplanet/Jobs/DeimosAssassinateBounty",
                        "rewards": "/Lotus/Types/Game/MissionDecks/DeimosMissionRewards/TierATableARewards",
                        "masteryReq": 0,
                        "minEnemyLevel": 5,
                        "maxEnemyLevel": 15,
                        "xpAmounts": [
                            5,
                            5,
                            5
                        ]
                    },
                    {
                        "jobType": "/Lotus/Types/Gameplay/InfestedMicroplanet/Jobs/DeimosGrnSurvivorBounty",
                        "rewards": "/Lotus/Types/Game/MissionDecks/DeimosMissionRewards/TierCTableARewards",
                        "masteryReq": 1,
                        "minEnemyLevel": 15,
                        "maxEnemyLevel": 25,
                        "xpAmounts": [
                            9,
                            9,
                            9
                        ]
                    },
                    {
                        "jobType": "/Lotus/Types/Gameplay/InfestedMicroplanet/Jobs/DeimosEndlessPurifyBounty",
                        "rewards": "/Lotus/Types/Game/MissionDecks/DeimosMissionRewards/TierBTableARewards",
                        "masteryReq": 5,
                        "minEnemyLevel": 25,
                        "maxEnemyLevel": 30,
                        "endless": true,
                        "xpAmounts": [
                            14,
                            14,
                            14
                        ]
                    },
                    {
                        "jobType": "/Lotus/Types/Gameplay/InfestedMicroplanet/Jobs/DeimosPurifyBounty",
                        "rewards": "/Lotus/Types/Game/MissionDecks/DeimosMissionRewards/TierDTableBRewards",
                        "masteryReq": 2,
                        "minEnemyLevel": 30,
                        "maxEnemyLevel": 40,
                        "xpAmounts": [
                            17,
                            17,
                            17,
                            26
                        ]
                    },
                    {
                        "jobType": "/Lotus/Types/Gameplay/InfestedMicroplanet/Jobs/DeimosCrpSurvivorBounty",
                        "rewards": "/Lotus/Types/Game/MissionDecks/DeimosMissionRewards/TierETableARewards",
                        "masteryReq": 3,
                        "minEnemyLevel": 40,
                        "maxEnemyLevel": 60,
                        "xpAmounts": [
                            20,
                            20,
                            20,
                            20,
                            38
                        ]
                    },
                    {
                        "jobType": "/Lotus/Types/Gameplay/InfestedMicroplanet/Jobs/DeimosExcavateBounty",
                        "rewards": "/Lotus/Types/Game/MissionDecks/DeimosMissionRewards/TierETableARewards",
                        "masteryReq": 10,
                        "minEnemyLevel": 100,
                        "maxEnemyLevel": 100,
                        "xpAmounts": [
                            25,
                            25,
                            25,
                            25,
                            50
                        ]
                    },
                    {
                        "rewards": "/Lotus/Types/Game/MissionDecks/DeimosMissionRewards/VaultBountyTierATableCRewards",
                        "masteryReq": 5,
                        "minEnemyLevel": 30,
                        "maxEnemyLevel": 40,
                        "xpAmounts": [
                            2,
                            2,
                            2,
                            4
                        ],
                        "locationTag": "ChamberB",
                        "isVault": true
                    },
                    {
                        "rewards": "/Lotus/Types/Game/MissionDecks/DeimosMissionRewards/VaultBountyTierBTableCRewards",
                        "masteryReq": 5,
                        "minEnemyLevel": 40,
                        "maxEnemyLevel": 50,
                        "xpAmounts": [
                            4,
                            4,
                            4,
                            5
                        ],
                        "locationTag": "ChamberA",
                        "isVault": true
                    },
                    {
                        "rewards": "/Lotus/Types/Game/MissionDecks/DeimosMissionRewards/VaultBountyTierCTableCRewards",
                        "masteryReq": 5,
                        "minEnemyLevel": 50,
                        "maxEnemyLevel": 60,
                        "xpAmounts": [
                            5,
                            5,
                            5,
                            7
                        ],
                        "locationTag": "ChamberC",
                        "isVault": true
                    }
                ]
            },
            {
                "_id": {
                    "$oid": "6a1cdb830000000000000036"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780276099727"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780285098601"
                    }
                },
                "Tag": "ZarimanSyndicate",
                "Seed": 41422,
                "Nodes": []
            },
            {
                "_id": {
                    "$oid": "6a1cdb830000000000000006"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780276099727"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780285098601"
                    }
                },
                "Tag": "HexSyndicate",
                "Seed": 41422,
                "Nodes": []
            },
            {
                "_id": {
                    "$oid": "6a1cdb830000000000000010"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780276099727"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780285098601"
                    }
                },
                "Tag": "CetusSyndicate",
                "Seed": 41421,
                "Nodes": [],
                "Jobs": [
                    {
                        "jobType": "/Lotus/Types/Gameplay/Eidolon/Jobs/AttritionBountyExt",
                        "rewards": "/Lotus/Types/Game/MissionDecks/EidolonJobMissionRewards/TierATableARewards",
                        "masteryReq": 0,
                        "minEnemyLevel": 5,
                        "maxEnemyLevel": 15,
                        "xpAmounts": [
                            340,
                            340,
                            340
                        ]
                    },
                    {
                        "jobType": "/Lotus/Types/Gameplay/Eidolon/Jobs/AttritionBountySab",
                        "rewards": "/Lotus/Types/Game/MissionDecks/EidolonJobMissionRewards/TierBTableARewards",
                        "masteryReq": 1,
                        "minEnemyLevel": 10,
                        "maxEnemyLevel": 30,
                        "xpAmounts": [
                            590,
                            590,
                            590
                        ]
                    },
                    {
                        "jobType": "/Lotus/Types/Gameplay/Eidolon/Jobs/ReclamationBountyCap",
                        "rewards": "/Lotus/Types/Game/MissionDecks/EidolonJobMissionRewards/TierCTableARewards",
                        "masteryReq": 2,
                        "minEnemyLevel": 20,
                        "maxEnemyLevel": 40,
                        "xpAmounts": [
                            650,
                            650,
                            650,
                            960
                        ]
                    },
                    {
                        "jobType": "/Lotus/Types/Gameplay/Eidolon/Jobs/AttritionBountyCap",
                        "rewards": "/Lotus/Types/Game/MissionDecks/EidolonJobMissionRewards/TierDTableARewards",
                        "masteryReq": 3,
                        "minEnemyLevel": 30,
                        "maxEnemyLevel": 50,
                        "xpAmounts": [
                            630,
                            630,
                            630,
                            630,
                            1240
                        ]
                    },
                    {
                        "jobType": "/Lotus/Types/Gameplay/Eidolon/Jobs/RescueBountyResc",
                        "rewards": "/Lotus/Types/Game/MissionDecks/EidolonJobMissionRewards/TierETableARewards",
                        "masteryReq": 5,
                        "minEnemyLevel": 40,
                        "maxEnemyLevel": 60,
                        "xpAmounts": [
                            740,
                            740,
                            740,
                            740,
                            1450
                        ]
                    },
                    {
                        "jobType": "/Lotus/Types/Gameplay/Eidolon/Jobs/ReclamationBountyTheft",
                        "rewards": "/Lotus/Types/Game/MissionDecks/EidolonJobMissionRewards/TierETableARewards",
                        "masteryReq": 10,
                        "minEnemyLevel": 100,
                        "maxEnemyLevel": 100,
                        "xpAmounts": [
                            840,
                            840,
                            840,
                            840,
                            1660
                        ]
                    },
                    {
                        "jobType": "/Lotus/Types/Gameplay/Eidolon/Jobs/Narmer/AttritionBountyLib",
                        "rewards": "/Lotus/Types/Game/MissionDecks/EidolonJobMissionRewards/NarmerTableARewards",
                        "masteryReq": 0,
                        "minEnemyLevel": 50,
                        "maxEnemyLevel": 70,
                        "xpAmounts": [
                            810,
                            810,
                            810,
                            810,
                            1580
                        ]
                    }
                ]
            },
            {
                "_id": {
                    "$oid": "6a1cdb830000000000000004"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780276099727"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780285098601"
                    }
                },
                "Tag": "EntratiLabSyndicate",
                "Seed": 41422,
                "Nodes": []
            },
            {
                "_id": {
                    "$oid": "6a1cdb830000000000000032"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780276099727"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780285098601"
                    }
                },
                "Tag": "SolarisSyndicate",
                "Seed": 41421,
                "Nodes": [],
                "Jobs": [
                    {
                        "jobType": "/Lotus/Types/Gameplay/Venus/Jobs/VenusTheftJobResource",
                        "rewards": "/Lotus/Types/Game/MissionDecks/VenusJobMissionRewards/VenusTierATableARewards",
                        "masteryReq": 0,
                        "minEnemyLevel": 5,
                        "maxEnemyLevel": 15,
                        "xpAmounts": [
                            470,
                            470,
                            470
                        ]
                    },
                    {
                        "jobType": "/Lotus/Types/Gameplay/Venus/Jobs/VenusCullJobAssassinate",
                        "rewards": "/Lotus/Types/Game/MissionDecks/VenusJobMissionRewards/VenusTierBTableARewards",
                        "masteryReq": 1,
                        "minEnemyLevel": 10,
                        "maxEnemyLevel": 30,
                        "xpAmounts": [
                            700,
                            700,
                            700
                        ]
                    },
                    {
                        "jobType": "/Lotus/Types/Gameplay/Venus/Jobs/VenusCullJobExterminate",
                        "rewards": "/Lotus/Types/Game/MissionDecks/VenusJobMissionRewards/VenusTierCTableARewards",
                        "masteryReq": 2,
                        "minEnemyLevel": 20,
                        "maxEnemyLevel": 40,
                        "xpAmounts": [
                            580,
                            580,
                            580,
                            860
                        ]
                    },
                    {
                        "jobType": "/Lotus/Types/Gameplay/Venus/Jobs/VenusHelpingJobResource",
                        "rewards": "/Lotus/Types/Game/MissionDecks/VenusJobMissionRewards/VenusTierDTableARewards",
                        "masteryReq": 3,
                        "minEnemyLevel": 30,
                        "maxEnemyLevel": 50,
                        "xpAmounts": [
                            550,
                            550,
                            550,
                            550,
                            1080
                        ]
                    },
                    {
                        "jobType": "/Lotus/Types/Gameplay/Venus/Jobs/VenusIntelJobResource",
                        "rewards": "/Lotus/Types/Game/MissionDecks/VenusJobMissionRewards/VenusTierETableARewards",
                        "masteryReq": 5,
                        "minEnemyLevel": 40,
                        "maxEnemyLevel": 60,
                        "xpAmounts": [
                            750,
                            750,
                            750,
                            750,
                            1480
                        ]
                    },
                    {
                        "jobType": "/Lotus/Types/Gameplay/Venus/Jobs/VenusChaosJobExcavation",
                        "rewards": "/Lotus/Types/Game/MissionDecks/VenusJobMissionRewards/VenusTierETableARewards",
                        "masteryReq": 10,
                        "minEnemyLevel": 100,
                        "maxEnemyLevel": 100,
                        "xpAmounts": [
                            840,
                            840,
                            840,
                            840,
                            1660
                        ]
                    },
                    {
                        "jobType": "/Lotus/Types/Gameplay/Venus/Jobs/Narmer/NarmerVenusCullJobAssassinate",
                        "rewards": "/Lotus/Types/Game/MissionDecks/EidolonJobMissionRewards/NarmerTableARewards",
                        "masteryReq": 0,
                        "minEnemyLevel": 50,
                        "maxEnemyLevel": 70,
                        "xpAmounts": [
                            830,
                            830,
                            830,
                            830,
                            1640
                        ]
                    }
                ]
            }
        ],
        "ActiveMissions": [
            {
                "_id": {
                    "$oid": "6a1ccb824f87a67d258ce5b1"
                },
                "Region": 16,
                "Seed": 41673,
                "Activation": {
                    "$date": {
                        "$numberLong": "1780272002871"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780279039090"
                    }
                },
                "Node": "SettlementNode11",
                "MissionType": "MT_DEFENSE",
                "Modifier": "VoidT2"
            },
            {
                "_id": {
                    "$oid": "6a1ccb824f87a67d258ce5b3"
                },
                "Region": 5,
                "Seed": 19269,
                "Activation": {
                    "$date": {
                        "$numberLong": "1780272002871"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780278475796"
                    }
                },
                "Node": "SolNode97",
                "MissionType": "MT_INTEL",
                "Modifier": "VoidT2"
            },
            {
                "_id": {
                    "$oid": "6a1ccecac61e50df5e8ce5b1"
                },
                "Region": 8,
                "Seed": 90754,
                "Activation": {
                    "$date": {
                        "$numberLong": "1780272842518"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780278683115"
                    }
                },
                "Node": "SolNode17",
                "MissionType": "MT_DEFENSE",
                "Modifier": "VoidT3"
            },
            {
                "_id": {
                    "$oid": "6a1ccecac61e50df5e8ce5b2"
                },
                "Region": 15,
                "Seed": 86753,
                "Activation": {
                    "$date": {
                        "$numberLong": "1780272842518"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780278850634"
                    }
                },
                "Node": "SolNode412",
                "MissionType": "MT_TERRITORY",
                "Modifier": "VoidT3"
            },
            {
                "_id": {
                    "$oid": "6a1ccf42647b38833e8ce5b1"
                },
                "Region": 11,
                "Seed": 24609,
                "Activation": {
                    "$date": {
                        "$numberLong": "1780272962412"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780278672650"
                    }
                },
                "Node": "SolNode166",
                "MissionType": "MT_SURVIVAL",
                "Modifier": "VoidT4"
            },
            {
                "_id": {
                    "$oid": "6a1ccf42647b38833e8ce5b3"
                },
                "Region": 9,
                "Seed": 95620,
                "Activation": {
                    "$date": {
                        "$numberLong": "1780272962412"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780280053553"
                    }
                },
                "Node": "SolNode4",
                "MissionType": "MT_EXTERMINATION",
                "Modifier": "VoidT4"
            },
            {
                "_id": {
                    "$oid": "6a1ccff6bc70a233b98ce5b2"
                },
                "Region": 3,
                "Seed": 39503,
                "Activation": {
                    "$date": {
                        "$numberLong": "1780273142343"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780280272359"
                    }
                },
                "Node": "SolNode79",
                "MissionType": "MT_INTEL",
                "Modifier": "VoidT1",
                "Hard": true
            },
            {
                "_id": {
                    "$oid": "6a1ccff6bc70a233b98ce5b1"
                },
                "Region": 4,
                "Seed": 99094,
                "Activation": {
                    "$date": {
                        "$numberLong": "1780273142343"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780279254151"
                    }
                },
                "Node": "SolNode41",
                "MissionType": "MT_INTEL",
                "Modifier": "VoidT1",
                "Hard": true
            },
            {
                "_id": {
                    "$oid": "6a1cd122acff13c7f68ce5b1"
                },
                "Region": 19,
                "Seed": 67677,
                "Activation": {
                    "$date": {
                        "$numberLong": "1780273442669"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780280621170"
                    }
                },
                "Node": "SolNode744",
                "MissionType": "MT_SURVIVAL",
                "Modifier": "VoidT5"
            },
            {
                "_id": {
                    "$oid": "6a1cd122acff13c7f68ce5b3"
                },
                "Region": 10,
                "Seed": 58426,
                "Activation": {
                    "$date": {
                        "$numberLong": "1780273442669"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780279940814"
                    }
                },
                "Node": "SolNode146",
                "MissionType": "MT_SURVIVAL",
                "Modifier": "VoidT2",
                "Hard": true
            },
            {
                "_id": {
                    "$oid": "6a1cd7b2c47aede9ea8ce5b1"
                },
                "Region": 4,
                "Seed": 75088,
                "Activation": {
                    "$date": {
                        "$numberLong": "1780275122497"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780279368766"
                    }
                },
                "Node": "SolNode36",
                "MissionType": "MT_RESCUE",
                "Modifier": "VoidT1"
            },
            {
                "_id": {
                    "$oid": "6a1cd7b2c47aede9ea8ce5b2"
                },
                "Region": 2,
                "Seed": 99894,
                "Activation": {
                    "$date": {
                        "$numberLong": "1780275122497"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780281013236"
                    }
                },
                "Node": "SolNode107",
                "MissionType": "MT_CAPTURE",
                "Modifier": "VoidT1"
            },
            {
                "_id": {
                    "$oid": "6a1cd7b2c47aede9ea8ce5b3"
                },
                "Region": 3,
                "Seed": 5772,
                "Activation": {
                    "$date": {
                        "$numberLong": "1780275122497"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780282283032"
                    }
                },
                "Node": "SolNode63",
                "MissionType": "MT_CAPTURE",
                "Modifier": "VoidT1"
            },
            {
                "_id": {
                    "$oid": "6a1cd91a57fbefbc1b8ce5b1"
                },
                "Region": 18,
                "Seed": 92263,
                "Activation": {
                    "$date": {
                        "$numberLong": "1780275482454"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780281249360"
                    }
                },
                "Node": "SolNode310",
                "MissionType": "MT_SURVIVAL",
                "Modifier": "VoidT6"
            },
            {
                "_id": {
                    "$oid": "6a1cd99326b8d9395f8ce5b1"
                },
                "Region": 8,
                "Seed": 56433,
                "Activation": {
                    "$date": {
                        "$numberLong": "1780275603016"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780281181921"
                    }
                },
                "Node": "SolNode78",
                "MissionType": "MT_RESCUE",
                "Modifier": "VoidT3",
                "Hard": true
            },
            {
                "_id": {
                    "$oid": "6a1cd99326b8d9395f8ce5b2"
                },
                "Region": 7,
                "Seed": 11692,
                "Activation": {
                    "$date": {
                        "$numberLong": "1780275603016"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780281994291"
                    }
                },
                "Node": "SolNode122",
                "MissionType": "MT_DEFENSE",
                "Modifier": "VoidT3",
                "Hard": true
            },
            {
                "_id": {
                    "$oid": "6a1cda8394750265fd8ce5b2"
                },
                "Region": 9,
                "Seed": 41020,
                "Activation": {
                    "$date": {
                        "$numberLong": "1780275843131"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780282253887"
                    }
                },
                "Node": "SolNode38",
                "MissionType": "MT_MOBILE_DEFENSE",
                "Modifier": "VoidT4",
                "Hard": true
            },
            {
                "_id": {
                    "$oid": "6a1cda8394750265fd8ce5b1"
                },
                "Region": 12,
                "Seed": 84937,
                "Activation": {
                    "$date": {
                        "$numberLong": "1780275843131"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780279795012"
                    }
                },
                "Node": "SolNode196",
                "MissionType": "MT_MOBILE_DEFENSE",
                "Modifier": "VoidT4",
                "Hard": true
            },
            {
                "_id": {
                    "$oid": "6a1cda8394750265fd8ce5b3"
                },
                "Region": 15,
                "Seed": 68295,
                "Activation": {
                    "$date": {
                        "$numberLong": "1780275843131"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780281907690"
                    }
                },
                "Node": "SolNode408",
                "MissionType": "MT_DEFENSE",
                "Modifier": "VoidT4",
                "Hard": true
            },
            {
                "_id": {
                    "$oid": "6a1cdc62a0f3c928648ce5b1"
                },
                "Region": 22,
                "Seed": 46995,
                "Activation": {
                    "$date": {
                        "$numberLong": "1780276322379"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780283211823"
                    }
                },
                "Node": "SolNode230",
                "MissionType": "MT_CORRUPTION",
                "Modifier": "VoidT6",
                "Hard": true
            },
            {
                "_id": {
                    "$oid": "6a1cdc62a0f3c928648ce5b2"
                },
                "Region": 18,
                "Seed": 12954,
                "Activation": {
                    "$date": {
                        "$numberLong": "1780276322379"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780282953498"
                    }
                },
                "Node": "SolNode309",
                "MissionType": "MT_SURVIVAL",
                "Modifier": "VoidT6",
                "Hard": true
            },
            {
                "_id": {
                    "$oid": "6a1cdc62a0f3c928648ce5b3"
                },
                "Region": 17,
                "Seed": 57513,
                "Activation": {
                    "$date": {
                        "$numberLong": "1780276322379"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780283032789"
                    }
                },
                "Node": "SolNode718",
                "MissionType": "MT_ALCHEMY",
                "Modifier": "VoidT6",
                "Hard": true
            },
            {
                "_id": {
                    "$oid": "6a1ce23e3d4b6881898ce5b1"
                },
                "Region": 19,
                "Seed": 17801,
                "Activation": {
                    "$date": {
                        "$numberLong": "1780277822305"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780284571251"
                    }
                },
                "Node": "SolNode748",
                "MissionType": "MT_RESCUE",
                "Modifier": "VoidT5",
                "Hard": true
            }
        ],
        "GlobalUpgrades": [],
        "FlashSales": [
            {
                "TypeName": "/Lotus/Types/StoreItems/Packages/InitiateIIIConsolePack",
                "ShowInMarket": true,
                "HideFromMarket": true,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1727691900000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1893456000000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/StoreItems/Packages/2025Bundles/GlamrockSupporterPack",
                "ShowInMarket": true,
                "HideFromMarket": true,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1757602800000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1893499020000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/StoreItems/Packages/2024Bundles/ShrineMaidenSupporterPack",
                "ShowInMarket": true,
                "HideFromMarket": true,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1747897200000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1894358760000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/StoreItems/Packages/2025Bundles/EncoreGeminiSupPack",
                "ShowInMarket": true,
                "HideFromMarket": true,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1757602800000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1893498960000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/StoreItems/Packages/TNWMarketBundle",
                "PremiumOverride": 145,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1709308800000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1893510000000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/StoreItems/Packages/2024Bundles/GeminiSkinsSupporterPack",
                "ShowInMarket": true,
                "HideFromMarket": true,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1757602800000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1893498840000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/StoreItems/Packages/AOTZMarketBundle",
                "PremiumOverride": 35,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1709308800000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1893510000000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/StoreItems/Packages/TnDeimosSupporterArmourBundle",
                "PremiumOverride": 110,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1709308800000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1893510000000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/StoreItems/Packages/2024Bundles/VoltNovaSumoDeluxePack",
                "ShowInMarket": true,
                "HideFromMarket": true,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1747897200000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1894358760000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/StoreItems/Packages/VeilbreakerSupporterPack",
                "ShowInMarket": true,
                "HideFromMarket": true,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1672591560000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1895849220000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/StoreItems/Packages/2025Bundles/TC2025DigitalPack",
                "ShowInMarket": true,
                "HideFromMarket": true,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1753441200000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1895570760000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/StoreItems/Packages/HODMarketBundle",
                "PremiumOverride": 465,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1709308800000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1893510000000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/StoreItems/Packages/2024Bundles/JadeShadowsSupporterPack",
                "ShowInMarket": true,
                "HideFromMarket": true,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1740585600000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1895961600000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/StoreItems/Packages/2024Bundles/Cyte09SupporterPack",
                "ShowInMarket": true,
                "HideFromMarket": true,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1757602800000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1893498900000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/StoreItems/Packages/2025Bundles/RhinoHeirloomPack",
                "ShowInMarket": true,
                "HideFromMarket": true,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1753110000000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1893492420000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/StoreItems/Packages/2025Bundles/2025SupporterPack",
                "ShowInMarket": true,
                "HideFromMarket": true,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1771430400000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1893456000000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/StoreItems/Packages/2024Bundles/GeminiHexCompleteSupporterPack",
                "ShowInMarket": true,
                "HideFromMarket": true,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1764777900000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1893456000000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/StoreItems/Packages/2025Bundles/EncoreCompSupPack",
                "ShowInMarket": true,
                "HideFromMarket": true,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1764777900000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1893456000000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/StoreItems/Packages/2025Bundles/ValkyrHeirloomPack",
                "ShowInMarket": true,
                "HideFromMarket": true,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1770825600000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1893510000000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Upgrades/Skins/Frost/UnlockFrostNoble",
                "Discount": 20,
                "PremiumOverride": 40,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1779926400000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1780358400000"
                    }
                },
                "DailySaleGenerated": true
            },
            {
                "TypeName": "/Lotus/Types/StoreItems/AvatarImages/AvatarImageHildrynPrideCommunity",
                "RegularOverride": 1,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1779980400000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1782791940000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/Items/ShipDecos/Venus/PrideCommunityDisplay",
                "RegularOverride": 1,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1779980400000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1782791940000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/StoreItems/AvatarImages/AvatarImagePrideGlyph",
                "RegularOverride": 1,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1779980400000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1782791940000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/Items/ShipDecos/HeartOroRainbowDeco",
                "RegularOverride": 25000,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1779980400000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1782791940000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/StoreItems/SuitCustomizations/ColourPickerPrideItemB",
                "RegularOverride": 1,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1779980400000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1782791940000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/StoreItems/AvatarImages/AvatarImagePrideLotusSymbolGlyph",
                "RegularOverride": 1,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1779980400000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1782791940000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/Items/ShipDecos/Venus/Pride2024Display",
                "RegularOverride": 1,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1779980400000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1782791940000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/StoreItems/AvatarImages/AvatarImagePride2025Glyph",
                "RegularOverride": 1,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1779980400000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1782791940000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/Items/ShipDecos/Pride2026Poster",
                "RegularOverride": 1,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1779980400000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1782791940000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/Items/ShipDecos/Pride2in1Display",
                "RegularOverride": 1,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1779980400000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1782791940000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/Items/ShipDecos/Pride2023Display",
                "RegularOverride": 1,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1779980400000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1782791940000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/Items/ShipDecos/Events/NeonPrideWings",
                "RegularOverride": 25000,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1779980400000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1782791940000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/StoreItems/AvatarImages/AvatarImagePrideCommunity",
                "RegularOverride": 1,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1779980400000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1782791940000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/Items/ShipDecos/Props/Seasonal/Pride2026SquarePictureFrame",
                "RegularOverride": 1,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1779980400000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1782791940000"
                    }
                }
            },
            {
                "TypeName": "/Lotus/Types/StoreItems/Packages/TennoSaisBundle",
                "Discount": 17,
                "PremiumOverride": 125,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1780012800000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1780444800000"
                    }
                },
                "DailySaleGenerated": true
            },
            {
                "TypeName": "/Lotus/Upgrades/Skins/Catbrows/Armor/CatbrowArmorB",
                "Discount": 17,
                "PremiumOverride": 75,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1780099200000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1780531200000"
                    }
                },
                "DailySaleGenerated": true
            },
            {
                "TypeName": "/Lotus/Upgrades/Skins/Rhino/UnlockRhinoAgile",
                "Discount": 20,
                "PremiumOverride": 40,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1780185600000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1780617600000"
                    }
                },
                "DailySaleGenerated": true
            },
            {
                "TypeName": "/Lotus/Types/StoreItems/Packages/DeluxeBundles/StyanaxDeluxeSkinBundle",
                "Discount": 19,
                "PremiumOverride": 240,
                "StartDate": {
                    "$date": {
                        "$numberLong": "1780272000000"
                    }
                },
                "EndDate": {
                    "$date": {
                        "$numberLong": "1780704000000"
                    }
                },
                "DailySaleGenerated": true
            }
        ],
        "SkuSales": [],
        "InGameMarket": {
            "LandingPage": {
                "Categories": [
                    {
                        "CategoryName": "NEW_PLAYER",
                        "Name": "/Lotus/Language/Store/NewPlayerCategoryTitle",
                        "Icon": "newplayer",
                        "AddToMenu": true,
                        "Items": [
                            "/Lotus/Types/StoreItems/Packages/2026Bundles/2026Q1Battlekit",
                            "/Lotus/StoreItems/Powersuits/MonkeyKing/MonkeyKing",
                            "/Lotus/StoreItems/Weapons/Tenno/Melee/SwordsAndBoards/MeleeContestWinnerOne/TennoSwordShield",
                            "/Lotus/StoreItems/Upgrades/Skins/Effects/WerewolfEphemera",
                            "/Lotus/StoreItems/Types/StoreItems/SlotItems/TwoWeaponSlotItem",
                            "/Lotus/StoreItems/Powersuits/Wisp/Wisp",
                            "/Lotus/StoreItems/Weapons/Tenno/Shotgun/Shotgun",
                            "/Lotus/StoreItems/Powersuits/Rhino/Rhino",
                            "/Lotus/StoreItems/Weapons/Corpus/Pistols/CrpAirPistol/CrpAirPistolArray",
                            "/Lotus/Types/StoreItems/Boosters/AffinityBooster3DayStoreItem"
                        ]
                    },
                    {
                        "CategoryName": "NEW",
                        "Name": "/Lotus/Language/Menu/Store_New",
                        "Icon": "new",
                        "Items": [
                            "/Lotus/Types/StoreItems/Packages/2026Bundles/TC2026DigitalPack"
                        ]
                    },
                    {
                        "CategoryName": "POPULAR",
                        "Name": "/Lotus/Language/Menu/StorePopular",
                        "Icon": "popular",
                        "AddToMenu": true,
                        "Items": [
                            "/Lotus/Types/StoreItems/Packages/2026Bundles/TC2026DigitalPack",
                            "/Lotus/Types/StoreItems/Packages/PrimeAccess2Tier3StoreItem",
                            "/Lotus/Types/StoreItems/Packages/PrimeAccess2CompleteStoreItem",
                            "/Lotus/Types/StoreItems/Packages/2026Bundles/GaussGrendelDeluxePack",
                            "/Lotus/StoreItems/Upgrades/Skins/Wisp/WF1999WispSkin",
                            "/Lotus/Types/StoreItems/Packages/FormaPack",
                            "/Lotus/Types/StoreItems/Boosters/ResourceAmount30DayStoreItem",
                            "/Lotus/StoreItems/Upgrades/Skins/Volt/VoltDeluxeRaijinSkin",
                            "/Lotus/StoreItems/Upgrades/Skins/Jade/WF1999NyxSkin",
                            "/Lotus/Types/StoreItems/Packages/DeluxeBundles/GaussGrendelDeluxeIISkinBundle",
                            "/Lotus/StoreItems/Upgrades/Skins/MonkeyKing/WukongDeluxeBSkin",
                            "/Lotus/StoreItems/Upgrades/Skins/Berserker/ValkyrHeirloomSkin",
                            "/Lotus/Types/StoreItems/Boosters/ResourceDropChance30DayStoreItem",
                            "/Lotus/Types/StoreItems/Packages/DeluxeBundles/GaussDeluxeIISkinBundle",
                            "/Lotus/StoreItems/Upgrades/Skins/AntiMatter/WF1999NovaSkin"
                        ]
                    },
                    {
                        "CategoryName": "COMMUNITY",
                        "Name": "/Lotus/Language/Store/CommunityCategoryTitle",
                        "Icon": "community",
                        "AddToMenu": true,
                        "Items": [
                            "/Lotus/StoreItems/Types/StoreItems/AvatarImages/AvatarImagePrideLotusSymbolGlyph",
                            "/Lotus/StoreItems/Types/Items/ShipDecos/Pride2026Poster",
                            "/Lotus/StoreItems/Types/Items/ShipDecos/Props/Seasonal/Pride2026SquarePictureFrame",
                            "/Lotus/StoreItems/Types/Items/ShipDecos/HeartOroRainbowDeco",
                            "/Lotus/StoreItems/Types/Items/ShipDecos/Pride2in1Display",
                            "/Lotus/StoreItems/Types/StoreItems/AvatarImages/AvatarImagePride2025Glyph",
                            "/Lotus/StoreItems/Types/StoreItems/SuitCustomizations/ColourPickerPrideItemB",
                            "/Lotus/StoreItems/Types/Items/ShipDecos/Venus/PrideCommunityDisplay",
                            "/Lotus/StoreItems/Types/StoreItems/AvatarImages/AvatarImagePrideCommunity",
                            "/Lotus/StoreItems/Types/Items/ShipDecos/Pride2023Display",
                            "/Lotus/StoreItems/Types/StoreItems/AvatarImages/AvatarImageHildrynPrideCommunity",
                            "/Lotus/StoreItems/Types/Items/ShipDecos/Venus/Pride2024Display",
                            "/Lotus/StoreItems/Types/StoreItems/AvatarImages/AvatarImagePrideGlyph",
                            "/Lotus/StoreItems/Types/Items/ShipDecos/Events/NeonPrideWings"
                        ]
                    },
                    {
                        "CategoryName": "TENNOGEN",
                        "Name": "/Lotus/Language/Menu/Store_Tennogen",
                        "Icon": "tennogen",
                        "Items": [
                            "/Lotus/StoreItems/Upgrades/Skins/Hoplite/SWRaevuzStyanaxSkin",
                            "/Lotus/StoreItems/Upgrades/Skins/AntiMatter/SWNetraselleNovaSkin",
                            "/Lotus/StoreItems/Upgrades/Skins/SteamWorkshop/Melee/Hammer/SWMaulleusHammerSkin",
                            "/Lotus/StoreItems/Upgrades/Skins/Crowns/SWZamariuSignaCrown",
                            "/Lotus/StoreItems/Upgrades/Skins/Crowns/SWSignaPragmaticaCrown"
                        ]
                    },
                    {
                        "CategoryName": "HEIRLOOM",
                        "Name": "/Lotus/Language/Store/HeirloomCategoryTitle",
                        "Icon": "heirloom",
                        "AddToMenu": true,
                        "Items": [
                            "/Lotus/Types/StoreItems/Packages/2026Bundles/VaubanHeirloomPack",
                            "/Lotus/StoreItems/Upgrades/Skins/Trapper/VaubanHeirloomSkin",
                            "/Lotus/StoreItems/Upgrades/Skins/Crowns/HeirloomVaubanCrown",
                            "/Lotus/StoreItems/Types/StoreItems/SuitCustomizations/ColourPickerVaubanHeirloom",
                            "/Lotus/StoreItems/Types/Items/ShipDecos/TarotCardVaubanHeirloom",
                            "/Lotus/StoreItems/Types/StoreItems/AvatarImages/HeirloomVaubanGlyph",
                            "/Lotus/StoreItems/Types/StoreItems/AvatarImages/HeirloomVaubanGlyphSumo",
                            "/Lotus/StoreItems/Upgrades/Skins/Sigils/HeirloomVaubanSigil",
                            "/Lotus/StoreItems/Upgrades/Skins/Sigils/HeirloomVaubanSigilSumo",
                            "/Lotus/Types/StoreItems/Packages/HeirloomPackValkyr",
                            "/Lotus/StoreItems/Upgrades/Skins/Berserker/ValkyrHeirloomSkin",
                            "/Lotus/StoreItems/Upgrades/Skins/Crowns/HeirloomValkyrCrown",
                            "/Lotus/StoreItems/Types/StoreItems/SuitCustomizations/ColourPickerValkyrHeirloom",
                            "/Lotus/StoreItems/Types/Items/ShipDecos/TarotCardValkyrHeirloom",
                            "/Lotus/StoreItems/Types/StoreItems/AvatarImages/HeirloomValkyrGlyph",
                            "/Lotus/StoreItems/Upgrades/Skins/Sigils/HeirloomValkyrSigil",
                            "/Lotus/Types/StoreItems/Packages/HeirloomPackRhino",
                            "/Lotus/StoreItems/Upgrades/Skins/Rhino/RhinoHeirloomSkin",
                            "/Lotus/StoreItems/Upgrades/Skins/Crowns/HeirloomRhinoCrown",
                            "/Lotus/StoreItems/Types/StoreItems/SuitCustomizations/ColourPickerRhinoHeirloom",
                            "/Lotus/StoreItems/Types/Items/ShipDecos/TarotCardRhinoHeirloom",
                            "/Lotus/StoreItems/Types/StoreItems/AvatarImages/HeirloomRhinoGlyph",
                            "/Lotus/StoreItems/Upgrades/Skins/Sigils/HeirloomRhinoSigil",
                            "/Lotus/Types/StoreItems/Packages/HeirloomPackEmber",
                            "/Lotus/StoreItems/Upgrades/Skins/Ember/EmberHeirloomSkin",
                            "/Lotus/StoreItems/Upgrades/Skins/Crowns/HeirloomEmberCrown",
                            "/Lotus/StoreItems/Types/StoreItems/SuitCustomizations/ColourPickerEmberHeirloom",
                            "/Lotus/StoreItems/Types/Items/ShipDecos/TarotCardEmberHeirloom",
                            "/Lotus/StoreItems/Types/StoreItems/AvatarImages/HeirloomEmberGlyph",
                            "/Lotus/StoreItems/Upgrades/Skins/Sigils/HeirloomEmberSigil"
                        ]
                    },
                    {
                        "CategoryName": "SALE",
                        "Name": "/Lotus/Language/Menu/Store_Sale",
                        "Icon": "sale",
                        "AddToMenu": true,
                        "Items": []
                    },
                    {
                        "CategoryName": "WISH_LIST",
                        "Name": "/Lotus/Language/Menu/Store_Wishlist",
                        "Icon": "wishlist",
                        "Items": []
                    },
                    {
                        "CategoryName": "PREMIUM_BUNDLES",
                        "Name": "/Lotus/Language/Store/Store_PremiumBundles",
                        "Icon": "premiumbundles",
                        "Items": [
                            "/Lotus/Types/StoreItems/Packages/2026Bundles/TC2026DigitalPack",
                            "/Lotus/Types/StoreItems/Packages/2026Bundles/FollieSupporterPack",
                            "/Lotus/Types/StoreItems/Packages/2026Bundles/GaussGrendelDeluxePack",
                            "/Lotus/Types/StoreItems/Packages/2026Bundles/VaubanHeirloomPack",
                            "/Lotus/Types/StoreItems/Packages/2026Bundles/2026Q1Battlekit",
                            "/Lotus/Types/StoreItems/Packages/2025Bundles/TOPCompSupPack",
                            "/Lotus/Types/StoreItems/Packages/2025Bundles/TOPGeminiSupPack",
                            "/Lotus/Types/StoreItems/Packages/2025Bundles/TOPUrielWFSupPack",
                            "/Lotus/Types/StoreItems/Packages/PrimeAccess2Tier3StoreItem",
                            "/Lotus/Types/StoreItems/Packages/PrimeAccess2CompleteStoreItem",
                            "/Lotus/Types/StoreItems/Packages/2025Bundles/NokkoSupporterPack",
                            "/Lotus/Types/StoreItems/Packages/2025Bundles/WukongDeluxeSupporterPack",
                            "/Lotus/Types/StoreItems/Packages/2025Bundles/OraxiaSupporterPack",
                            "/Lotus/Types/StoreItems/Packages/PrimeAccess2Tier2StoreItem",
                            "/Lotus/Types/StoreItems/Packages/PrimeAccess2StoreItem",
                            "/Lotus/Types/StoreItems/Packages/PrimeAccess2Tier1StoreItem",
                            "/Lotus/Types/StoreItems/Packages/PrimeAccess2AccessoryStoreItem",
                            "/Lotus/Types/StoreItems/Packages/PrimeAccessory2StoreItem",
                            "/Lotus/Types/StoreItems/Packages/2024Bundles/WeaponStarterPack"
                        ]
                    },
                    {
                        "CategoryName": "QUICK_BUY",
                        "Name": "/Lotus/Language/Store/TopSeller_Title",
                        "Icon": "quickbuy",
                        "Items": [
                            "/Lotus/Types/StoreItems/Packages/FormaPack",
                            "/Lotus/StoreItems/Types/Items/MiscItems/OrokinCatalyst",
                            "/Lotus/StoreItems/Types/Items/MiscItems/WeaponUtilityUnlocker"
                        ]
                    }
                ]
            }
        },
        "Invasions": [
            {
                "_id": {
                    "$oid": "6a1b3737d6f3f95f538ce5b2"
                },
                "Faction": "FC_CORPUS",
                "DefenderFaction": "FC_GRINEER",
                "Node": "SolNode42",
                "Count": 29253,
                "Goal": 36000,
                "LocTag": "/Lotus/Language/Menu/CorpusInvasionGeneric",
                "Completed": false,
                "ChainID": {
                    "$oid": "6a1867aec991b73c4e8ce5b1"
                },
                "AttackerReward": {
                    "countedItems": [
                        {
                            "ItemType": "/Lotus/Types/Items/Research/EnergyComponent",
                            "ItemCount": 3
                        }
                    ]
                },
                "AttackerMissionInfo": {
                    "seed": 17862,
                    "faction": "FC_GRINEER"
                },
                "DefenderReward": {
                    "countedItems": [
                        {
                            "ItemType": "/Lotus/Types/Items/Research/ChemComponent",
                            "ItemCount": 3
                        }
                    ]
                },
                "DefenderMissionInfo": {
                    "seed": 351868,
                    "faction": "FC_CORPUS"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780169149259"
                    }
                }
            },
            {
                "_id": {
                    "$oid": "6a1b629254a70c4b4f8ce5b1"
                },
                "Faction": "FC_INFESTATION",
                "DefenderFaction": "FC_CORPUS",
                "Node": "SolNode127",
                "Count": -26781,
                "Goal": 30000,
                "LocTag": "/Lotus/Language/Menu/InfestedInvasionBoss",
                "Completed": false,
                "ChainID": {
                    "$oid": "6a1b360bd69c5e30328ce5b1"
                },
                "AttackerReward": [],
                "AttackerMissionInfo": {
                    "seed": 806897,
                    "faction": "FC_CORPUS"
                },
                "DefenderReward": {
                    "countedItems": [
                        {
                            "ItemType": "/Lotus/Types/Items/MiscItems/InfestedAladCoordinate",
                            "ItemCount": 1
                        }
                    ]
                },
                "DefenderMissionInfo": {
                    "seed": 163022,
                    "faction": "FC_INFESTATION",
                    "missionReward": []
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780179601861"
                    }
                }
            },
            {
                "_id": {
                    "$oid": "6a1b6ac6b2548091e98ce5b1"
                },
                "Faction": "FC_GRINEER",
                "DefenderFaction": "FC_CORPUS",
                "Node": "SolNode211",
                "Count": 10131,
                "Goal": 44000,
                "LocTag": "/Lotus/Language/Menu/GrineerInvasionGeneric",
                "Completed": false,
                "ChainID": {
                    "$oid": "6a1b6ac6b2548091e98ce5b1"
                },
                "AttackerReward": {
                    "countedItems": [
                        {
                            "ItemType": "/Lotus/Types/Recipes/Weapons/WeaponParts/GrineerCombatKnifeHilt",
                            "ItemCount": 1
                        }
                    ]
                },
                "AttackerMissionInfo": {
                    "seed": 553656,
                    "faction": "FC_CORPUS"
                },
                "DefenderReward": {
                    "countedItems": [
                        {
                            "ItemType": "/Lotus/Types/Recipes/Weapons/WeaponParts/DeraVandalReceiver",
                            "ItemCount": 1
                        }
                    ]
                },
                "DefenderMissionInfo": {
                    "seed": 770893,
                    "faction": "FC_GRINEER"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780224951017"
                    }
                }
            },
            {
                "_id": {
                    "$oid": "6a1bdb468feef43c388ce5b3"
                },
                "Faction": "FC_INFESTATION",
                "DefenderFaction": "FC_CORPUS",
                "Node": "SolNode53",
                "Count": -22698,
                "Goal": 30000,
                "LocTag": "/Lotus/Language/Menu/InfestedInvasionBoss",
                "Completed": false,
                "ChainID": {
                    "$oid": "6a1bad921a8c5aca898ce5b1"
                },
                "AttackerReward": [],
                "AttackerMissionInfo": {
                    "seed": 502992,
                    "faction": "FC_CORPUS"
                },
                "DefenderReward": {
                    "countedItems": [
                        {
                            "ItemType": "/Lotus/Types/Items/Research/EnergyComponent",
                            "ItemCount": 3
                        }
                    ]
                },
                "DefenderMissionInfo": {
                    "seed": 540959,
                    "faction": "FC_INFESTATION",
                    "missionReward": []
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780210501831"
                    }
                }
            },
            {
                "_id": {
                    "$oid": "6a1c01f2e010ee4e898ce5b1"
                },
                "Faction": "FC_INFESTATION",
                "DefenderFaction": "FC_CORPUS",
                "Node": "SolNode126",
                "Count": -41130,
                "Goal": 41000,
                "LocTag": "/Lotus/Language/Menu/InfestedInvasionGeneric",
                "Completed": true,
                "ChainID": {
                    "$oid": "6a1bad921a8c5aca898ce5b1"
                },
                "AttackerReward": [],
                "AttackerMissionInfo": {
                    "seed": 867712,
                    "faction": "FC_CORPUS"
                },
                "DefenderReward": {
                    "countedItems": [
                        {
                            "ItemType": "/Lotus/Types/Items/Research/EnergyComponent",
                            "ItemCount": 3
                        }
                    ]
                },
                "DefenderMissionInfo": {
                    "seed": 806400,
                    "faction": "FC_INFESTATION"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780220401854"
                    }
                }
            },
            {
                "_id": {
                    "$oid": "6a1c01f2e010ee4e898ce5b2"
                },
                "Faction": "FC_INFESTATION",
                "DefenderFaction": "FC_CORPUS",
                "Node": "SolNode25",
                "Count": -41590,
                "Goal": 41000,
                "LocTag": "/Lotus/Language/Menu/InfestedInvasionGeneric",
                "Completed": true,
                "ChainID": {
                    "$oid": "6a1bad921a8c5aca898ce5b1"
                },
                "AttackerReward": [],
                "AttackerMissionInfo": {
                    "seed": 369435,
                    "faction": "FC_CORPUS"
                },
                "DefenderReward": {
                    "countedItems": [
                        {
                            "ItemType": "/Lotus/Types/Items/Research/BioComponent",
                            "ItemCount": 1
                        }
                    ]
                },
                "DefenderMissionInfo": {
                    "seed": 334357,
                    "faction": "FC_INFESTATION"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780220401854"
                    }
                }
            },
            {
                "_id": {
                    "$oid": "6a1c125ae269faf7ab8ce5b1"
                },
                "Faction": "FC_INFESTATION",
                "DefenderFaction": "FC_CORPUS",
                "Node": "SolNode100",
                "Count": -45027,
                "Goal": 45000,
                "LocTag": "/Lotus/Language/Menu/InfestedInvasionGeneric",
                "Completed": true,
                "ChainID": {
                    "$oid": "6a1bad921a8c5aca898ce5b1"
                },
                "AttackerReward": [],
                "AttackerMissionInfo": {
                    "seed": 197170,
                    "faction": "FC_CORPUS"
                },
                "DefenderReward": {
                    "countedItems": [
                        {
                            "ItemType": "/Lotus/Types/Items/Research/BioComponent",
                            "ItemCount": 1
                        }
                    ]
                },
                "DefenderMissionInfo": {
                    "seed": 96763,
                    "faction": "FC_INFESTATION"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780224601984"
                    }
                }
            },
            {
                "_id": {
                    "$oid": "6a1c21961554f139758ce5b1"
                },
                "Faction": "FC_INFESTATION",
                "DefenderFaction": "FC_CORPUS",
                "Node": "SolNode88",
                "Count": -36043,
                "Goal": 36000,
                "LocTag": "/Lotus/Language/Menu/InfestedInvasionGeneric",
                "Completed": true,
                "ChainID": {
                    "$oid": "6a1bad921a8c5aca898ce5b1"
                },
                "AttackerReward": [],
                "AttackerMissionInfo": {
                    "seed": 951963,
                    "faction": "FC_CORPUS"
                },
                "DefenderReward": {
                    "countedItems": [
                        {
                            "ItemType": "/Lotus/Types/Items/Research/EnergyComponent",
                            "ItemCount": 3
                        }
                    ]
                },
                "DefenderMissionInfo": {
                    "seed": 422029,
                    "faction": "FC_INFESTATION"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780228501832"
                    }
                }
            },
            {
                "_id": {
                    "$oid": "6a1c3583497b0afe588ce5b1"
                },
                "Faction": "FC_INFESTATION",
                "DefenderFaction": "FC_CORPUS",
                "Node": "SolNode125",
                "Count": -38026,
                "Goal": 38000,
                "LocTag": "/Lotus/Language/Menu/InfestedInvasionGeneric",
                "Completed": true,
                "ChainID": {
                    "$oid": "6a1bad921a8c5aca898ce5b1"
                },
                "AttackerReward": [],
                "AttackerMissionInfo": {
                    "seed": 95829,
                    "faction": "FC_CORPUS"
                },
                "DefenderReward": {
                    "countedItems": [
                        {
                            "ItemType": "/Lotus/Types/Items/Research/EnergyComponent",
                            "ItemCount": 3
                        }
                    ]
                },
                "DefenderMissionInfo": {
                    "seed": 517283,
                    "faction": "FC_INFESTATION"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1780233602487"
                    }
                }
            }
        ],
        "HubEvents": [],
        "NodeOverrides": [
            {
                "_id": {
                    "$oid": "549b18e9b029cef5991d6aec"
                },
                "Node": "EuropaHUB",
                "Hide": true
            },
            {
                "_id": {
                    "$oid": "54a1737aeb658f6cbccf70ff"
                },
                "Node": "ErisHUB",
                "Hide": true
            },
            {
                "_id": {
                    "$oid": "54a736ddec12f80bd6e9e326"
                },
                "Node": "VenusHUB",
                "Hide": true
            },
            {
                "_id": {
                    "$oid": "5ad9f9bb6df82a56eabf3d44"
                },
                "Node": "SolNode802",
                "Seed": 10978328
            },
            {
                "_id": {
                    "$oid": "5b8817c2bd4f253264d6aa91"
                },
                "Node": "EarthHUB",
                "Hide": false,
                "LevelOverride": "/Lotus/Levels/Proc/Hub/RelayStationHubTwoB",
                "Activation": {
                    "$date": {
                        "$numberLong": "1535646600000"
                    }
                }
            },
            {
                "_id": {
                    "$oid": "5d24d1f674491d51f8d44473"
                },
                "Node": "MercuryHUB",
                "Hide": true,
                "LevelOverride": "/Lotus/Levels/Proc/Hub/RelayStationHubHydroid",
                "Activation": {
                    "$date": {
                        "$numberLong": "1563030000000"
                    }
                }
            }
        ],
        "VoidTraders": [
            {
                "_id": {
                    "$oid": "5d1e07a0a38e4a4fdd7cefca"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1781269200000"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1781442000000"
                    }
                },
                "Character": "Baro'Ki Teel",
                "Node": "SaturnHUB"
            }
        ],
        "PrimeVaultTraders": [
            {
                "_id": {
                    "$oid": "631f8c4ac36af423770eaa97"
                },
                "Activation": {
                    "$date": {
                        "$numberLong": "1778781600000"
                    }
                },
                "InitialStartDate": {
                    "$date": {
                        "$numberLong": "1662738144266"
                    }
                },
                "Node": "TradeHUB1",
                "Manifest": [
                    {
                        "ItemType": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVRhinoPrimeSinglePack",
                        "PrimePrice": 6
                    },
                    {
                        "ItemType": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVRhinoNyxPrimeDualPack",
                        "PrimePrice": 10
                    },
                    {
                        "ItemType": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVNyxPrimeSinglePack",
                        "PrimePrice": 6
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Powersuits/Rhino/RhinoPrime",
                        "PrimePrice": 3
                    },
                    {
                        "ItemType": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVDistillingExtractorPrimeSet",
                        "PrimePrice": 1
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Scarves/NoruPrimeScarf",
                        "PrimePrice": 2
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Weapons/Tenno/Melee/Gauntlet/PrimeAnkyros/PrimeAnkyros",
                        "PrimePrice": 2
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Weapons/Tenno/LongGuns/PrimeBoltor/PrimeBoltor",
                        "PrimePrice": 2
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Powersuits/Jade/NyxPrime",
                        "PrimePrice": 3
                    },
                    {
                        "ItemType": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVTargisPrimeArmorSet",
                        "PrimePrice": 2
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/MeleeDangles/ValaPrimeMeleeDangle",
                        "PrimePrice": 1
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Weapons/Tenno/Melee/Axe/PrimeScindo/PrimeScindoWeapon",
                        "PrimePrice": 2
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Weapons/Tenno/ThrowingWeapons/PrimeThrowingStar/PrimeHikou",
                        "PrimePrice": 2
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/Items/ShipDecos/RhinoPrimeBobbleHead",
                        "PrimePrice": 1
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/Items/ShipDecos/NyxPrimeBobbleHead",
                        "PrimePrice": 1
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/Game/Projections/T1VoidProjectionRhinoNyxVaultABronze",
                        "RegularPrice": 1
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/Game/Projections/T2VoidProjectionRhinoNyxVaultABronze",
                        "RegularPrice": 1
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/Game/Projections/T3VoidProjectionRhinoNyxVaultABronze",
                        "RegularPrice": 1
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/Game/Projections/T4VoidProjectionRhinoNyxVaultABronze",
                        "RegularPrice": 1
                    }
                ],
                "Expiry": {
                    "$date": {
                        "$numberLong": "1781200800000"
                    }
                },
                "EvergreenManifest": [
                    {
                        "ItemType": "/Lotus/StoreItems/Weapons/Tenno/Rifle/BratonPrime",
                        "PrimePrice": 1
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Weapons/Tenno/LongGuns/PrimeBurston/PrimeBurston",
                        "PrimePrice": 2
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Weapons/Tenno/Melee/DualDagger/FangPrimeDagger",
                        "PrimePrice": 2
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Weapons/Tenno/Pistols/PrimeLex/PrimeLex",
                        "PrimePrice": 1
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Scarves/PrimeTwitchScarf",
                        "PrimePrice": 2
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Scarves/TwitchPrimeScarf",
                        "PrimePrice": 2
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/MeleeDangles/TwitchPrimeMeleeDangle",
                        "PrimePrice": 1
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Liset/LisetSkinTwitchPrime",
                        "RegularPrice": 10
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Sigils/TwitchPrimeSigil",
                        "PrimePrice": 1
                    },
                    {
                        "ItemType": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVNecraloidBundle",
                        "RegularPrice": 10
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Clan/TwitchNecraloidBadgeItem",
                        "RegularPrice": 5
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Scarves/InfMembraneCape",
                        "RegularPrice": 10
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Scarves/AmazonOniSyandana",
                        "RegularPrice": 10
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/Game/ShipScenes/PrimeLisetFiligreeScene",
                        "PrimePrice": 1
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/Game/ShipScenes/CorpusShipScene",
                        "RegularPrice": 7
                    },
                    {
                        "ItemType": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVVayasPrimeAccessories",
                        "PrimePrice": 2
                    },
                    {
                        "ItemType": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVAviaPrimeArmorSet",
                        "PrimePrice": 2
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Scarves/PrimeAviaSyandana",
                        "PrimePrice": 2
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Scarves/LasBackpackMedkitSyandana",
                        "PrimePrice": 1
                    },
                    {
                        "PrimePrice": 1,
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Scarves/TC2025OrokinScarf"
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Effects/TwitchEphemera",
                        "PrimePrice": 1
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Loki/LokiTwitchSkin",
                        "PrimePrice": 1
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/StoreItems/AvatarImages/AvatarImageLokiActionTwitch",
                        "RegularPrice": 5
                    },
                    {
                        "ItemType": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVVervArmorSet",
                        "PrimePrice": 1
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Promo/Twitch/LisetSkinTwitch",
                        "RegularPrice": 10
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Sigils/TwitchPromo2021Sigil",
                        "RegularPrice": 5
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Clan/TwitchPromo2021BadgeItem",
                        "RegularPrice": 5
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Weapons/Redeemer/RedeemerTwitchSkin",
                        "RegularPrice": 7
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Promo/Twitch/Twitch2021AfurisSkin",
                        "RegularPrice": 7
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Promo/Twitch/TwitchRubicoSkin",
                        "RegularPrice": 7
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Promo/Twitch/TwitchPentaSkin",
                        "RegularPrice": 7
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Scarves/Twitch2021Syandana",
                        "RegularPrice": 10
                    },
                    {
                        "ItemType": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVVervSentrexSentAccessories",
                        "RegularPrice": 7
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Kubrows/Armor/Twitch2021IfritKubrowArmor",
                        "RegularPrice": 7
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Catbrows/Armor/Twitch2021MyrdinCatbrowArmor",
                        "RegularPrice": 7
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/Items/ShipDecos/LisetPropCleaningDroneTwitch",
                        "RegularPrice": 7
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/Game/QuartersWallpapers/TwitchPrimeWallpaper",
                        "RegularPrice": 5
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Scarves/FlameScarfRefresh",
                        "RegularPrice": 10
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/MeleeDangles/FireMeleeDangleRefresh",
                        "RegularPrice": 6
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Effects/OpulaEphemera",
                        "RegularPrice": 10
                    },
                    {
                        "ItemType": "/Lotus/Types/StoreItems/Packages/PrimeColorPackA",
                        "PrimePrice": 1
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/StoreItems/SuitCustomizations/ColourPickerPrimeDayItemA",
                        "RegularPrice": 5
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/StoreItems/SuitCustomizations/ColourPickerTwitchItemC",
                        "RegularPrice": 5
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Promo/Twitch/TigrisTwitchSkin",
                        "RegularPrice": 7
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Promo/Twitch/TwitchAnkyros",
                        "RegularPrice": 7
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Sigils/TwitchProminenceSigil",
                        "RegularPrice": 5
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Promo/Twitch/ExcaliburTwitchSkin",
                        "RegularPrice": 12
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Volt/VoltTwitchSkin",
                        "RegularPrice": 12
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Scarves/TnLargeCapeTwitch",
                        "RegularPrice": 10
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Bard/BardTwitchSkin",
                        "PrimePrice": 1
                    },
                    {
                        "ItemType": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVIridosArmorSet",
                        "RegularPrice": 10
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Characters/Tenno/Accessory/Scarves/U17IntermScarf/IridosUdyatSkin/UdyatPrimeGamingSyandana",
                        "RegularPrice": 10
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Promo/Twitch/PyranaTwitchSkin",
                        "RegularPrice": 7
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Promo/Twitch/OgrisTwitchSkin",
                        "RegularPrice": 7
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Weapons/Tonfa/KronenTwitchSkin",
                        "RegularPrice": 7
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Promo/Twitch/AkjagaraIridosSkin",
                        "RegularPrice": 7
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Liset/LisetInsectSkinIridos",
                        "RegularPrice": 10
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Necramech/TefilahIridosSkin",
                        "RegularPrice": 10
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/Items/ShipDecos/LisetPropShawzinTwitch",
                        "RegularPrice": 7
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/StoreItems/AvatarImages/AvatarImageOctaviaActionTwitch",
                        "RegularPrice": 5
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Effects/OvergrowthEphemera",
                        "RegularPrice": 10
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/Items/ShipDecos/ResourceDecoItemCetusWispTwitch",
                        "RegularPrice": 7
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/StoreItems/AvatarImages/AvatarImageSwitch2Glyph",
                        "RegularPrice": 5
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Sigils/Switch2Sigil",
                        "RegularPrice": 5
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Upgrades/Skins/Koumei/KoumeiWarfanSkin",
                        "RegularPrice": 10
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/Items/SongItems/GaussPrimeSongItem",
                        "RegularPrice": 5
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/Items/SongItems/GaraPrimeSongItem",
                        "RegularPrice": 5
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/Items/SongItems/GrendelPrimeSongItem",
                        "RegularPrice": 5
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/Items/SongItems/HildrynPrimeSongItem",
                        "RegularPrice": 5
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/Items/SongItems/HydroidPrimeSongItem",
                        "RegularPrice": 5
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/Items/SongItems/KhoraPrimeSongItem",
                        "RegularPrice": 5
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/Items/SongItems/NekrosPrimeSongItem",
                        "RegularPrice": 5
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/Items/SongItems/NidusPrimeSongItem",
                        "RegularPrice": 5
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/Items/SongItems/OberonPrimeSongItem",
                        "RegularPrice": 5
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/Items/SongItems/OctaviaPrimeSongItem",
                        "RegularPrice": 5
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/Items/SongItems/RevenantPrimeSongItem",
                        "RegularPrice": 5
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/Items/SongItems/VaubanPrimeSongItem",
                        "RegularPrice": 5
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/Items/SongItems/ProteaPrimeSongItem",
                        "RegularPrice": 5
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/Items/SongItems/WispPrimeSongItem",
                        "RegularPrice": 5
                    },
                    {
                        "ItemType": "/Lotus/StoreItems/Types/Items/MiscItems/PrimeBucks",
                        "RegularPrice": 1
                    },
                    {
                        "ItemType": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVVoidTraceBundle",
                        "RegularPrice": 1
                    }
                ],
                "ScheduleInfo": [
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1667498400000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "0"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVEquinoxWukongPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1669921200000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "0"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVValkyrSarynPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1672945200000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1668711600000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVOberonPrimeSinglePack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1675364400000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1671130800000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVVoltLokiPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1677783600000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1674154800000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVAtlasVaubanPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1680804000000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1676473200000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVNekrosOberonPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1683223200000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1679594400000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVMagRhinoPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1685718000000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1682013600000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVNekrosOberonPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1688666400000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1684433100000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVInarosAshPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1691085600000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1687456800000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVBansheeMiragePrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1694109600000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1689876000000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVFrostMagPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1696528800000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1692900000000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVEquinoxWukongPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1698948000000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1695319200000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVZephyrChromaPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1703185200000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1697738400000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVNezhaOctaviaPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1704394800000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1697738400000"
                            }
                        },
                        "FeaturedItem": "/Lotus/StoreItems/Types/StoreItems/Packages/MegaPrimeVault/LastChanceItemC"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1705604400000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "0"
                            }
                        },
                        "FeaturedItem": "/Lotus/StoreItems/Types/StoreItems/Packages/MegaPrimeVault/LastChanceItemC"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1706814000000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "0"
                            }
                        },
                        "FeaturedItem": "/Lotus/StoreItems/Types/StoreItems/Packages/MegaPrimeVault/LastChanceItemC"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1708023600000"
                            }
                        },
                        "FeaturedItem": "/Lotus/StoreItems/Types/StoreItems/Packages/MegaPrimeVault/LastChanceItemC"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1710439200000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1706814000000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVBansheeMiragePrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1712858400000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1709233200000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVTitaniaGaraPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1715277600000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1711648800000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVInarosAshPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1717696800000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1714068000000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVEquinoxWukongPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1720116000000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1716487200000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVZephyrChromaPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1722535200000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1718906400000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVHarrowNekrosPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1724954400000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1721325600000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVMesaLimboPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1727373600000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1723744800000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVNezhaOctaviaPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1729792800000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1726164000000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVNovaTrinityPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1732215600000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1728583200000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVGarudaKhoraPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1734030000000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1731006000000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVIvaraOberonPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1736449200000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1732820400000"
                            }
                        },
                        "FeaturedItem": "/Lotus/StoreItems/Types/StoreItems/Packages/MegaPrimeVault/LastChanceItemC"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1738868400000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1734030000000"
                            }
                        },
                        "FeaturedItem": "/Lotus/StoreItems/Types/StoreItems/Packages/MegaPrimeVault/LastChanceItemB"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1739473200000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1732820400000"
                            }
                        },
                        "FeaturedItem": "/Lotus/StoreItems/Types/StoreItems/Packages/MegaPrimeVault/LastChanceItemA"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1741888800000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1738868400000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVInarosAshPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1744308000000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1740682800000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVNidusSarynPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1746727200000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1743098400000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVBansheeMiragePrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1749146400000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1745517600000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVNekrosOberonPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1751565600000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1747940280000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVRevenantBaruukPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1753984800000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1750356000000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVTitaniaGaraPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1756404000000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1752775200000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVEquinoxWukongPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1758823200000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1755194400000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVZephyrChromaPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1761242400000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1757613600000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVMagNovaPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1763665200000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1760032800000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVNezhaOctaviaPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1766084400000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1762455600000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVWispHildrynPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1768503600000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1764874800000"
                            }
                        },
                        "FeaturedItem": "/Lotus/StoreItems/Types/StoreItems/Packages/MegaPrimeVault/LastChanceItemC"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1770922800000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1766084400000"
                            }
                        },
                        "FeaturedItem": "/Lotus/StoreItems/Types/StoreItems/Packages/MegaPrimeVault/LastChanceItemB"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1771527600000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1768503600000"
                            }
                        },
                        "FeaturedItem": "/Lotus/StoreItems/Types/StoreItems/Packages/MegaPrimeVault/LastChanceItemA"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1773943200000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1770922800000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVAtlasVaubanPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1776362400000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1772737200000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVNovaTrinityPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1778781600000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1775152800000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVGaussGrendelPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1781200800000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1777572000000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVRhinoNyxPrimeDualPack"
                    },
                    {
                        "Expiry": {
                            "$date": {
                                "$numberLong": "1783620000000"
                            }
                        },
                        "PreviewHiddenUntil": {
                            "$date": {
                                "$numberLong": "1779991200000"
                            }
                        },
                        "FeaturedItem": "/Lotus/Types/StoreItems/Packages/MegaPrimeVault/MPVEquinoxWukongPrimeDualPack"
                    }
                ]
            }
        ],
        "VoidStorms": [
            {
                "_id": {
                    "$oid": "6a1cc6d2c788a8a71c8ce5b1"
                },
                "Node": "CrewBattleNode518",
                "Activation": {
                    "$date": {
                        "$numberLong": "1780273203351"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780278603351"
                    }
                },
                "ActiveMissionTier": "VoidT1"
            },
            {
                "_id": {
                    "$oid": "6a1cc6d2c788a8a71c8ce5b2"
                },
                "Node": "CrewBattleNode511",
                "Activation": {
                    "$date": {
                        "$numberLong": "1780273203353"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780278603353"
                    }
                },
                "ActiveMissionTier": "VoidT1"
            },
            {
                "_id": {
                    "$oid": "6a1cc6d2c788a8a71c8ce5b3"
                },
                "Node": "CrewBattleNode533",
                "Activation": {
                    "$date": {
                        "$numberLong": "1780273203355"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780278603355"
                    }
                },
                "ActiveMissionTier": "VoidT2"
            },
            {
                "_id": {
                    "$oid": "6a1cc6d2c788a8a71c8ce5b4"
                },
                "Node": "CrewBattleNode516",
                "Activation": {
                    "$date": {
                        "$numberLong": "1780273203356"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780278603356"
                    }
                },
                "ActiveMissionTier": "VoidT3"
            },
            {
                "_id": {
                    "$oid": "6a1cc6d2c788a8a71c8ce5b6"
                },
                "Node": "CrewBattleNode542",
                "Activation": {
                    "$date": {
                        "$numberLong": "1780273203360"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780278603360"
                    }
                },
                "ActiveMissionTier": "VoidT4"
            },
            {
                "_id": {
                    "$oid": "6a1cc6d2c788a8a71c8ce5b5"
                },
                "Node": "CrewBattleNode529",
                "Activation": {
                    "$date": {
                        "$numberLong": "1780273203358"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780278603358"
                    }
                },
                "ActiveMissionTier": "VoidT4"
            },
            {
                "_id": {
                    "$oid": "6a1cd4e270528256118ce5b3"
                },
                "Node": "CrewBattleNode501",
                "Activation": {
                    "$date": {
                        "$numberLong": "1780276803355"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780282203355"
                    }
                },
                "ActiveMissionTier": "VoidT2"
            },
            {
                "_id": {
                    "$oid": "6a1cd4e270528256118ce5b2"
                },
                "Node": "CrewBattleNode515",
                "Activation": {
                    "$date": {
                        "$numberLong": "1780276803353"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780282203353"
                    }
                },
                "ActiveMissionTier": "VoidT1"
            },
            {
                "_id": {
                    "$oid": "6a1cd4e270528256118ce5b1"
                },
                "Node": "CrewBattleNode509",
                "Activation": {
                    "$date": {
                        "$numberLong": "1780276803351"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780282203351"
                    }
                },
                "ActiveMissionTier": "VoidT1"
            },
            {
                "_id": {
                    "$oid": "6a1cd4e270528256118ce5b5"
                },
                "Node": "CrewBattleNode527",
                "Activation": {
                    "$date": {
                        "$numberLong": "1780276803358"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780282203358"
                    }
                },
                "ActiveMissionTier": "VoidT4"
            },
            {
                "_id": {
                    "$oid": "6a1cd4e270528256118ce5b4"
                },
                "Node": "CrewBattleNode524",
                "Activation": {
                    "$date": {
                        "$numberLong": "1780276803356"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780282203356"
                    }
                },
                "ActiveMissionTier": "VoidT3"
            },
            {
                "_id": {
                    "$oid": "6a1cd4e270528256118ce5b6"
                },
                "Node": "CrewBattleNode543",
                "Activation": {
                    "$date": {
                        "$numberLong": "1780276803360"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780282203360"
                    }
                },
                "ActiveMissionTier": "VoidT4"
            }
        ],
        "PrimeAccessAvailability": {
            "State": "PRIME2"
        },
        "PrimeVaultAvailabilities": [
            false,
            false,
            false,
            false,
            false
        ],
        "PrimeTokenAvailability": true,
        "DailyDeals": [
            {
                "StoreItem": "/Lotus/StoreItems/Types/Game/KubrowPet/Eggs/KubrowEgg",
                "Activation": {
                    "$date": {
                        "$numberLong": "1780203600000"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780297200000"
                    }
                },
                "Discount": 60,
                "OriginalPrice": 10,
                "SalePrice": 4,
                "AmountTotal": 100,
                "AmountSold": 100
            }
        ],
        "LibraryInfo": {
            "LastCompletedTargetType": "/Lotus/Types/Game/Library/Targets/Research7Target"
        },
        "PVPChallengeInstances": [
            {
                "_id": {
                    "$oid": "6a18da87bdc45101648ce5b1"
                },
                "challengeTypeRefID": "/Lotus/PVPChallengeTypes/PVPTimedChallengeGameModeWins",
                "startDate": {
                    "$date": {
                        "$numberLong": "1780013703299"
                    }
                },
                "endDate": {
                    "$date": {
                        "$numberLong": "1780618503299"
                    }
                },
                "params": [
                    {
                        "n": "ScriptParamValue",
                        "v": 6
                    }
                ],
                "isGenerated": true,
                "PVPMode": "PVPMODE_ALL",
                "subChallenges": [],
                "Category": "PVPChallengeTypeCategory_WEEKLY"
            },
            {
                "_id": {
                    "$oid": "6a18da87bdc45101648ce5b4"
                },
                "challengeTypeRefID": "/Lotus/PVPChallengeTypes/PVPTimedChallengeWeeklyStandardSet",
                "startDate": {
                    "$date": {
                        "$numberLong": "1780013703299"
                    }
                },
                "endDate": {
                    "$date": {
                        "$numberLong": "1780618503299"
                    }
                },
                "params": [
                    {
                        "n": "ScriptParamValue",
                        "v": 0
                    }
                ],
                "isGenerated": true,
                "PVPMode": "PVPMODE_NONE",
                "subChallenges": [
                    {
                        "$oid": "6a18da87bdc45101648ce5b1"
                    },
                    {
                        "$oid": "6a18da87bdc45101648ce5b2"
                    },
                    {
                        "$oid": "6a18da87bdc45101648ce5b3"
                    }
                ],
                "Category": "PVPChallengeTypeCategory_WEEKLY_ROOT"
            },
            {
                "_id": {
                    "$oid": "6a18da87bdc45101648ce5b3"
                },
                "challengeTypeRefID": "/Lotus/PVPChallengeTypes/PVPTimedChallengeOtherChallengeCompleteANY",
                "startDate": {
                    "$date": {
                        "$numberLong": "1780013703299"
                    }
                },
                "endDate": {
                    "$date": {
                        "$numberLong": "1780618503299"
                    }
                },
                "params": [
                    {
                        "n": "ScriptParamValue",
                        "v": 10
                    }
                ],
                "isGenerated": true,
                "PVPMode": "PVPMODE_ALL",
                "subChallenges": [],
                "Category": "PVPChallengeTypeCategory_WEEKLY"
            },
            {
                "_id": {
                    "$oid": "6a18da87bdc45101648ce5b2"
                },
                "challengeTypeRefID": "/Lotus/PVPChallengeTypes/PVPTimedChallengeGameModeComplete",
                "startDate": {
                    "$date": {
                        "$numberLong": "1780013703299"
                    }
                },
                "endDate": {
                    "$date": {
                        "$numberLong": "1780618503299"
                    }
                },
                "params": [
                    {
                        "n": "ScriptParamValue",
                        "v": 20
                    }
                ],
                "isGenerated": true,
                "PVPMode": "PVPMODE_ALL",
                "subChallenges": [],
                "Category": "PVPChallengeTypeCategory_WEEKLY"
            },
            {
                "_id": {
                    "$oid": "6a1c89e3ad05e58b368ce5b3"
                },
                "challengeTypeRefID": "/Lotus/PVPChallengeTypes/PVPTimedChallengeKillsStreakDominationHARD",
                "startDate": {
                    "$date": {
                        "$numberLong": "1780255203033"
                    }
                },
                "endDate": {
                    "$date": {
                        "$numberLong": "1780341603033"
                    }
                },
                "params": [
                    {
                        "n": "ScriptParamValue",
                        "v": 3
                    }
                ],
                "isGenerated": true,
                "PVPMode": "PVPMODE_TEAMDEATHMATCH",
                "subChallenges": [],
                "Category": "PVPChallengeTypeCategory_DAILY"
            },
            {
                "_id": {
                    "$oid": "6a1c89e3ad05e58b368ce5b1"
                },
                "challengeTypeRefID": "/Lotus/PVPChallengeTypes/PVPTimedChallengeMatchCompleteMEDIUM",
                "startDate": {
                    "$date": {
                        "$numberLong": "1780255203033"
                    }
                },
                "endDate": {
                    "$date": {
                        "$numberLong": "1780341603033"
                    }
                },
                "params": [
                    {
                        "n": "ScriptParamValue",
                        "v": 4
                    }
                ],
                "isGenerated": true,
                "PVPMode": "PVPMODE_CAPTURETHEFLAG",
                "subChallenges": [],
                "Category": "PVPChallengeTypeCategory_DAILY"
            },
            {
                "_id": {
                    "$oid": "6a1c89e3ad05e58b368ce5b2"
                },
                "challengeTypeRefID": "/Lotus/PVPChallengeTypes/PVPTimedChallengeFlagReturnEASY",
                "startDate": {
                    "$date": {
                        "$numberLong": "1780255203033"
                    }
                },
                "endDate": {
                    "$date": {
                        "$numberLong": "1780341603033"
                    }
                },
                "params": [
                    {
                        "n": "ScriptParamValue",
                        "v": 1
                    }
                ],
                "isGenerated": true,
                "PVPMode": "PVPMODE_CAPTURETHEFLAG",
                "subChallenges": [],
                "Category": "PVPChallengeTypeCategory_DAILY"
            },
            {
                "_id": {
                    "$oid": "6a1c89e3ad05e58b368ce5b4"
                },
                "challengeTypeRefID": "/Lotus/PVPChallengeTypes/PVPTimedChallengeKillsHeadShotsEASY",
                "startDate": {
                    "$date": {
                        "$numberLong": "1780255203033"
                    }
                },
                "endDate": {
                    "$date": {
                        "$numberLong": "1780341603033"
                    }
                },
                "params": [
                    {
                        "n": "ScriptParamValue",
                        "v": 1
                    }
                ],
                "isGenerated": true,
                "PVPMode": "PVPMODE_TEAMDEATHMATCH",
                "subChallenges": [],
                "Category": "PVPChallengeTypeCategory_DAILY"
            },
            {
                "_id": {
                    "$oid": "6a1c89e3ad05e58b368ce5b8"
                },
                "challengeTypeRefID": "/Lotus/PVPChallengeTypes/PVPTimedChallengeSpeedballChecksMEDIUM",
                "startDate": {
                    "$date": {
                        "$numberLong": "1780255203033"
                    }
                },
                "endDate": {
                    "$date": {
                        "$numberLong": "1780341603033"
                    }
                },
                "params": [
                    {
                        "n": "ScriptParamValue",
                        "v": 10
                    }
                ],
                "isGenerated": true,
                "PVPMode": "PVPMODE_SPEEDBALL",
                "subChallenges": [],
                "Category": "PVPChallengeTypeCategory_DAILY"
            },
            {
                "_id": {
                    "$oid": "6a1c89e3ad05e58b368ce5b5"
                },
                "challengeTypeRefID": "/Lotus/PVPChallengeTypes/PVPTimedChallengeMatchCompleteMEDIUM",
                "startDate": {
                    "$date": {
                        "$numberLong": "1780255203033"
                    }
                },
                "endDate": {
                    "$date": {
                        "$numberLong": "1780341603033"
                    }
                },
                "params": [
                    {
                        "n": "ScriptParamValue",
                        "v": 4
                    }
                ],
                "isGenerated": true,
                "PVPMode": "PVPMODE_DEATHMATCH",
                "subChallenges": [],
                "Category": "PVPChallengeTypeCategory_DAILY"
            },
            {
                "_id": {
                    "$oid": "6a1c89e3ad05e58b368ce5b7"
                },
                "challengeTypeRefID": "/Lotus/PVPChallengeTypes/PVPTimedChallengeSpeedballInterceptionsEASY",
                "startDate": {
                    "$date": {
                        "$numberLong": "1780255203033"
                    }
                },
                "endDate": {
                    "$date": {
                        "$numberLong": "1780341603033"
                    }
                },
                "params": [
                    {
                        "n": "ScriptParamValue",
                        "v": 3
                    }
                ],
                "isGenerated": true,
                "PVPMode": "PVPMODE_SPEEDBALL",
                "subChallenges": [],
                "Category": "PVPChallengeTypeCategory_DAILY"
            },
            {
                "_id": {
                    "$oid": "6a1c89e3ad05e58b368ce5b6"
                },
                "challengeTypeRefID": "/Lotus/PVPChallengeTypes/PVPTimedChallengeKillsPrimaryHARD",
                "startDate": {
                    "$date": {
                        "$numberLong": "1780255203033"
                    }
                },
                "endDate": {
                    "$date": {
                        "$numberLong": "1780341603033"
                    }
                },
                "params": [
                    {
                        "n": "ScriptParamValue",
                        "v": 3
                    }
                ],
                "isGenerated": true,
                "PVPMode": "PVPMODE_DEATHMATCH",
                "subChallenges": [],
                "Category": "PVPChallengeTypeCategory_DAILY"
            }
        ],
        "PersistentEnemies": [],
        "PVPAlternativeModes": [],
        "PVPActiveTournaments": [],
        "ProjectPct": [
            8.850133482891334,
            25.980390480621836,
            0
        ],
        "ConstructionProjects": [],
        "TwitchPromos": [],
        "ExperimentRecommended": [],
        "EndlessXpChoices": [
            {
                "Category": "EXC_NORMAL",
                "Choices": [
                    "Ivara",
                    "Inaros",
                    "Titania"
                ]
            },
            {
                "Category": "EXC_HARD",
                "Choices": [
                    "AckAndBrunt",
                    "Soma",
                    "Vasto",
                    "NamiSolo",
                    "Burston"
                ]
            }
        ],
        "EndlessXpSchedule": [
            {
                "Activation": {
                    "$date": {
                        "$numberLong": "1780272000000"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780876800000"
                    }
                },
                "CategoryChoices": [
                    {
                        "Category": "EXC_NORMAL",
                        "Choices": [
                            "Ivara",
                            "Inaros",
                            "Titania"
                        ]
                    },
                    {
                        "Category": "EXC_HARD",
                        "Choices": [
                            "AckAndBrunt",
                            "Soma",
                            "Vasto",
                            "NamiSolo",
                            "Burston"
                        ]
                    }
                ]
            }
        ],
        "ForceLogoutVersion": 0,
        "FeaturedGuilds": [
            {
                "_id": {
                    "$oid": "6686b05f4367086a050a7a70"
                },
                "Name": "Headless Torture#480",
                "Tier": 3,
                "AllianceId": {
                    "$oid": "5ec820fb0848b52e5156357c"
                },
                "HiddenPlatforms": {
                    "PLATFORM_SWITCH": true,
                    "PLATFORM_IOS": true
                },
                "IconOverride": 6
            },
            {
                "_id": {
                    "$oid": "54f7aa575e9051b9a6b71c13"
                },
                "Name": "Riven Police#157",
                "Tier": 3,
                "Emblem": true,
                "AllianceId": {
                    "$oid": "64750757e2bc7e55240cd443"
                },
                "HiddenPlatforms": {
                    "PLATFORM_IOS": true
                },
                "IconOverride": 5
            },
            {
                "_id": {
                    "$oid": "59b3aff4bda5639f87669883"
                },
                "Name": "ZENDRAGON#312",
                "Tier": 4,
                "Emblem": true,
                "AllianceId": {
                    "$oid": "5582f6e608c56f4e7e7b2ea9"
                },
                "HiddenPlatforms": {
                    "PLATFORM_IOS": true
                },
                "IconOverride": 1
            },
            {
                "_id": {
                    "$oid": "6639db7af9d67e438801f56c"
                },
                "Name": "A_L_T_R_O_N#679",
                "Tier": 4,
                "Emblem": true,
                "AllianceId": {
                    "$oid": "66f954b3269b9910720778db"
                },
                "HiddenPlatforms": {
                    "PLATFORM_IOS": true
                },
                "IconOverride": 1
            },
            {
                "_id": {
                    "$oid": "59fa073e069a1b296e019410"
                },
                "Name": "Black Lagoons#460",
                "Tier": 4,
                "Emblem": true,
                "AllianceId": {
                    "$oid": "5ec428291fbe6e2e877c8bf8"
                },
                "IconOverride": 4
            },
            {
                "_id": {
                    "$oid": "54283e6107c56f0e3b1e89bd"
                },
                "Name": "THE ONYX CHAPTER#480",
                "Tier": 4,
                "Emblem": true,
                "AllianceId": {
                    "$oid": "64750757e2bc7e55240cd443"
                },
                "IconOverride": 4
            },
            {
                "_id": {
                    "$oid": "6043028c9903735c172533e1"
                },
                "Name": "StoneHenge_Sentinels#869",
                "Tier": 4,
                "Emblem": true,
                "AllianceId": {
                    "$oid": "5e2deeb13874d77a3957423d"
                },
                "IconOverride": 6
            },
            {
                "_id": {
                    "$oid": "5a26bd3e9ab226b6ea19e66b"
                },
                "Name": "SECRET SYNDICATE#837",
                "Tier": 2,
                "Emblem": true,
                "AllianceId": {
                    "$oid": "64750757e2bc7e55240cd443"
                },
                "IconOverride": 2
            }
        ],
        "SeasonInfo": {
            "Activation": {
                "$date": {
                    "$numberLong": "1775662200000"
                }
            },
            "Expiry": {
                "$date": {
                    "$numberLong": "1793577600000"
                }
            },
            "AffiliationTag": "RadioLegionIntermission15Syndicate",
            "Season": 17,
            "Phase": 0,
            "Params": "",
            "ActiveChallenges": [
                {
                    "_id": {
                        "$oid": "001800080000000000000111"
                    },
                    "Daily": true,
                    "Activation": {
                        "$date": {
                            "$numberLong": "1780099200000"
                        }
                    },
                    "Expiry": {
                        "$date": {
                            "$numberLong": "1780358400000"
                        }
                    },
                    "Challenge": "/Lotus/Types/Challenges/Seasons/Daily/SeasonDailyCodexScan"
                },
                {
                    "_id": {
                        "$oid": "001800080000000000000112"
                    },
                    "Daily": true,
                    "Activation": {
                        "$date": {
                            "$numberLong": "1780185600000"
                        }
                    },
                    "Expiry": {
                        "$date": {
                            "$numberLong": "1780444800000"
                        }
                    },
                    "Challenge": "/Lotus/Types/Challenges/Seasons/Daily/SeasonDailyDeploySpecter"
                },
                {
                    "_id": {
                        "$oid": "001800090000000000000120"
                    },
                    "Daily": true,
                    "Activation": {
                        "$date": {
                            "$numberLong": "1780272000000"
                        }
                    },
                    "Expiry": {
                        "$date": {
                            "$numberLong": "1780531200000"
                        }
                    },
                    "Challenge": "/Lotus/Types/Challenges/Seasons/Daily/SeasonDailyPlaceMarker"
                },
                {
                    "_id": {
                        "$oid": "001800090000000000000113"
                    },
                    "Activation": {
                        "$date": {
                            "$numberLong": "1780272000000"
                        }
                    },
                    "Expiry": {
                        "$date": {
                            "$numberLong": "1780876800000"
                        }
                    },
                    "Challenge": "/Lotus/Types/Challenges/Seasons/Weekly/SeasonWeeklyPermanentCompleteMissions9"
                },
                {
                    "_id": {
                        "$oid": "001800090000000000000114"
                    },
                    "Activation": {
                        "$date": {
                            "$numberLong": "1780272000000"
                        }
                    },
                    "Expiry": {
                        "$date": {
                            "$numberLong": "1780876800000"
                        }
                    },
                    "Challenge": "/Lotus/Types/Challenges/Seasons/Weekly/SeasonWeeklyPermanentKillEximus9"
                },
                {
                    "_id": {
                        "$oid": "001800090000000000000115"
                    },
                    "Activation": {
                        "$date": {
                            "$numberLong": "1780272000000"
                        }
                    },
                    "Expiry": {
                        "$date": {
                            "$numberLong": "1780876800000"
                        }
                    },
                    "Challenge": "/Lotus/Types/Challenges/Seasons/Weekly/SeasonWeeklyPermanentKillEnemies9"
                },
                {
                    "_id": {
                        "$oid": "001800090000000000000116"
                    },
                    "Activation": {
                        "$date": {
                            "$numberLong": "1780272000000"
                        }
                    },
                    "Expiry": {
                        "$date": {
                            "$numberLong": "1780876800000"
                        }
                    },
                    "Challenge": "/Lotus/Types/Challenges/Seasons/Weekly/SeasonWeeklyCollector"
                },
                {
                    "_id": {
                        "$oid": "001800090000000000000117"
                    },
                    "Activation": {
                        "$date": {
                            "$numberLong": "1780272000000"
                        }
                    },
                    "Expiry": {
                        "$date": {
                            "$numberLong": "1780876800000"
                        }
                    },
                    "Challenge": "/Lotus/Types/Challenges/Seasons/Weekly/SeasonWeeklyCatchRareVenusFish"
                },
                {
                    "_id": {
                        "$oid": "001800090000000000000118"
                    },
                    "Activation": {
                        "$date": {
                            "$numberLong": "1780272000000"
                        }
                    },
                    "Expiry": {
                        "$date": {
                            "$numberLong": "1780876800000"
                        }
                    },
                    "Challenge": "/Lotus/Types/Challenges/Seasons/WeeklyHard/SeasonWeeklyHardCompleteSortie"
                },
                {
                    "_id": {
                        "$oid": "001800090000000000000119"
                    },
                    "Activation": {
                        "$date": {
                            "$numberLong": "1780272000000"
                        }
                    },
                    "Expiry": {
                        "$date": {
                            "$numberLong": "1780876800000"
                        }
                    },
                    "Challenge": "/Lotus/Types/Challenges/Seasons/WeeklyHard/SeasonWeeklyHardUnlockRelics"
                }
            ]
        },
        "KnownCalendarSeasons": [
            {
                "Activation": {
                    "$date": {
                        "$numberLong": "1780272000000"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780876800000"
                    }
                },
                "Days": [
                    {
                        "day": 1,
                        "events": []
                    },
                    {
                        "day": 7,
                        "events": [
                            {
                                "type": "CET_CHALLENGE",
                                "challenge": "/Lotus/Types/Challenges/Calendar1999/CalendarKillTechrotEnemiesEasy"
                            }
                        ]
                    },
                    {
                        "day": 18,
                        "events": [
                            {
                                "type": "CET_UPGRADE",
                                "upgrade": "/Lotus/Upgrades/Calendar/MeleeCritChance"
                            },
                            {
                                "type": "CET_UPGRADE",
                                "upgrade": "/Lotus/Upgrades/Calendar/EnergyOrbToAbilityRange"
                            },
                            {
                                "type": "CET_UPGRADE",
                                "upgrade": "/Lotus/Upgrades/Calendar/CompanionDamage"
                            }
                        ]
                    },
                    {
                        "day": 22,
                        "events": [
                            {
                                "type": "CET_CHALLENGE",
                                "challenge": "/Lotus/Types/Challenges/Calendar1999/CalendarKillEnemiesWithMeleeEasy"
                            }
                        ]
                    },
                    {
                        "day": 26,
                        "events": [
                            {
                                "type": "CET_REWARD",
                                "reward": "/Lotus/Types/StoreItems/Packages/Calendar/CalendarVosforPack"
                            },
                            {
                                "type": "CET_REWARD",
                                "reward": "/Lotus/StoreItems/Types/BoosterPacks/CalendarMajorArtifactPack"
                            }
                        ]
                    },
                    {
                        "day": 31,
                        "events": [
                            {
                                "type": "CET_REWARD",
                                "reward": "/Lotus/StoreItems/Types/BoosterPacks/CalendarArtifactPack"
                            },
                            {
                                "type": "CET_REWARD",
                                "reward": "/Lotus/StoreItems/Upgrades/Mods/FusionBundles/CircuitSilverSteelPathFusionBundle"
                            }
                        ]
                    },
                    {
                        "day": 38,
                        "events": [
                            {
                                "type": "CET_CHALLENGE",
                                "challenge": "/Lotus/Types/Challenges/Calendar1999/CalendarKillScaldraEnemiesMedium"
                            }
                        ]
                    },
                    {
                        "day": 45,
                        "events": []
                    },
                    {
                        "day": 46,
                        "events": [
                            {
                                "type": "CET_REWARD",
                                "reward": "/Lotus/StoreItems/Types/Items/MiscItems/WeaponMeleeArcaneUnlocker"
                            },
                            {
                                "type": "CET_REWARD",
                                "reward": "/Lotus/Types/StoreItems/Packages/Calendar/CalendarKuvaBundleSmall"
                            }
                        ]
                    },
                    {
                        "day": 47,
                        "events": [
                            {
                                "type": "CET_CHALLENGE",
                                "challenge": "/Lotus/Types/Challenges/Calendar1999/CalendarDestroyPropsMedium"
                            }
                        ]
                    },
                    {
                        "day": 50,
                        "events": [
                            {
                                "type": "CET_REWARD",
                                "reward": "/Lotus/Types/StoreItems/Packages/Calendar/CalendarVosforPack"
                            },
                            {
                                "type": "CET_REWARD",
                                "reward": "/Lotus/StoreItems/Types/Recipes/Components/FormaAuraBlueprint"
                            }
                        ]
                    },
                    {
                        "day": 53,
                        "events": [
                            {
                                "type": "CET_UPGRADE",
                                "upgrade": "/Lotus/Upgrades/Calendar/StatusChancePerAmmoSpent"
                            },
                            {
                                "type": "CET_UPGRADE",
                                "upgrade": "/Lotus/Upgrades/Calendar/AttackAndMovementSpeedOnCritMelee"
                            },
                            {
                                "type": "CET_UPGRADE",
                                "upgrade": "/Lotus/Upgrades/Calendar/OrbsDuplicateOnPickup"
                            }
                        ]
                    },
                    {
                        "day": 62,
                        "events": [
                            {
                                "type": "CET_CHALLENGE",
                                "challenge": "/Lotus/Types/Challenges/Calendar1999/CalendarKillScaldraEnemiesWithMeleeHard"
                            }
                        ]
                    },
                    {
                        "day": 74,
                        "events": []
                    },
                    {
                        "day": 76,
                        "events": [
                            {
                                "type": "CET_REWARD",
                                "reward": "/Lotus/StoreItems/Types/Items/MiscItems/WeaponPrimaryArcaneUnlocker"
                            },
                            {
                                "type": "CET_REWARD",
                                "reward": "/Lotus/StoreItems/Types/BoosterPacks/CalendarArtifactPack"
                            }
                        ]
                    },
                    {
                        "day": 78,
                        "events": [
                            {
                                "type": "CET_UPGRADE",
                                "upgrade": "/Lotus/Upgrades/Calendar/PunchToPrimary"
                            },
                            {
                                "type": "CET_UPGRADE",
                                "upgrade": "/Lotus/Upgrades/Calendar/CompanionDamage"
                            },
                            {
                                "type": "CET_UPGRADE",
                                "upgrade": "/Lotus/Upgrades/Calendar/MeleeCritChance"
                            }
                        ]
                    },
                    {
                        "day": 79,
                        "events": [
                            {
                                "type": "CET_CHALLENGE",
                                "challenge": "/Lotus/Types/Challenges/Calendar1999/CalendarKillTankHard"
                            }
                        ]
                    },
                    {
                        "day": 89,
                        "events": [
                            {
                                "type": "CET_REWARD",
                                "reward": "/Lotus/StoreItems/Types/Recipes/Components/OrokinCatalystBlueprint"
                            },
                            {
                                "type": "CET_REWARD",
                                "reward": "/Lotus/StoreItems/Types/Items/MiscItems/Forma"
                            }
                        ]
                    }
                ],
                "Season": "CST_WINTER",
                "YearIteration": 19,
                "Version": 19,
                "UpgradeAvaliabilityRequirements": [
                    "/Lotus/Upgrades/Calendar/1999UpgradeApplicationRequirement"
                ]
            }
        ],
        "Conquests": [
            {
                "Activation": {
                    "$date": {
                        "$numberLong": "1780272000000"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780876800000"
                    }
                },
                "Type": "CT_LAB",
                "Missions": [
                    {
                        "faction": "FC_MITW",
                        "missionType": "MT_DEFENSE",
                        "difficulties": [
                            {
                                "type": "CD_NORMAL",
                                "deviation": "HarshWords",
                                "risks": [
                                    "EMPBlackHole"
                                ]
                            },
                            {
                                "type": "CD_HARD",
                                "deviation": "HarshWords",
                                "risks": [
                                    "EMPBlackHole",
                                    "RegeneratingEnemies"
                                ]
                            }
                        ]
                    },
                    {
                        "faction": "FC_MITW",
                        "missionType": "MT_ARTIFACT",
                        "difficulties": [
                            {
                                "type": "CD_NORMAL",
                                "deviation": "StickyFingers",
                                "risks": [
                                    "ExplosiveCrawlers"
                                ]
                            },
                            {
                                "type": "CD_HARD",
                                "deviation": "StickyFingers",
                                "risks": [
                                    "ExplosiveCrawlers",
                                    "Quicksand"
                                ]
                            }
                        ]
                    },
                    {
                        "faction": "FC_MITW",
                        "missionType": "MT_ASSASSINATION",
                        "difficulties": [
                            {
                                "type": "CD_NORMAL",
                                "deviation": "InfiniteTide",
                                "risks": [
                                    "VoidAberration"
                                ]
                            },
                            {
                                "type": "CD_HARD",
                                "deviation": "InfiniteTide",
                                "risks": [
                                    "VoidAberration",
                                    "DrainingResiduals"
                                ]
                            }
                        ]
                    }
                ],
                "Variables": [
                    "Knifestep",
                    "Armorless",
                    "VoidEnergyOverload",
                    "Framecurse"
                ],
                "RandomSeed": 830028
            },
            {
                "Activation": {
                    "$date": {
                        "$numberLong": "1780272000000"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780876800000"
                    }
                },
                "Type": "CT_HEX",
                "Missions": [
                    {
                        "faction": "FC_SCALDRA",
                        "missionType": "MT_SURVIVAL",
                        "difficulties": [
                            {
                                "type": "CD_NORMAL",
                                "deviation": "ContaminationZone",
                                "risks": [
                                    "HostileOvergrowth"
                                ]
                            },
                            {
                                "type": "CD_HARD",
                                "deviation": "ContaminationZone",
                                "risks": [
                                    "HostileOvergrowth",
                                    "AcceleratedEnemies"
                                ]
                            }
                        ]
                    },
                    {
                        "faction": "FC_SCALDRA",
                        "missionType": "MT_DEFENSE",
                        "difficulties": [
                            {
                                "type": "CD_NORMAL",
                                "deviation": "DisruptiveSounds",
                                "risks": [
                                    "FactionSwarm_Scaldra"
                                ]
                            },
                            {
                                "type": "CD_HARD",
                                "deviation": "DisruptiveSounds",
                                "risks": [
                                    "FactionSwarm_Scaldra",
                                    "BalloonFest"
                                ]
                            }
                        ]
                    },
                    {
                        "faction": "FC_TECHROT",
                        "missionType": "MT_ENDLESS_CAPTURE",
                        "difficulties": [
                            {
                                "type": "CD_NORMAL",
                                "deviation": "DoubleTroubleLegacyte",
                                "risks": [
                                    "VoidAberration"
                                ]
                            },
                            {
                                "type": "CD_HARD",
                                "deviation": "DoubleTroubleLegacyte",
                                "risks": [
                                    "VoidAberration",
                                    "MiasmiteHive"
                                ]
                            }
                        ]
                    }
                ],
                "Variables": [
                    "DecayingFlesh",
                    "Starvation",
                    "Armorless",
                    "OperatorLockout"
                ],
                "RandomSeed": 800541
            }
        ],
        "Descents": [
            {
                "Activation": {
                    "$date": {
                        "$numberLong": "1780272000000"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1780876800000"
                    }
                },
                "RandSeed": 2398004995,
                "Challenges": [
                    {
                        "Index": 1,
                        "Type": "DT_INTERCEPTION",
                        "Challenge": "ShockingLeech",
                        "Level": "/Lotus/Levels/DevilTower/ArenaWaffle.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Narmer/PNWNarmerForestGrineerExterminate"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/ShockingLeechEnhancementAura"
                        ]
                    },
                    {
                        "Index": 2,
                        "Type": "DT_PRESURE_GAUGE",
                        "Challenge": "Sunlight",
                        "Level": "/Lotus/Levels/DevilTower/ArenaMango.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHCorpusExterminateHumans"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/DarknessAura",
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/SunlightAura"
                        ]
                    },
                    {
                        "Index": 3,
                        "Type": "DT_RACE",
                        "Challenge": "BasicRace",
                        "Level": "/Lotus/Levels/DevilTower/ArenaBagel.level",
                        "Specs": [],
                        "Auras": []
                    },
                    {
                        "Index": 4,
                        "Type": "DT_BREAK_TARGETS",
                        "Challenge": "NC_SlipAndSlide",
                        "Level": "/Lotus/Levels/DevilTower/ArenaCherry.level",
                        "Specs": [],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHSlipAndSlideAura"
                        ]
                    },
                    {
                        "Index": 5,
                        "Type": "DT_UNIQUE",
                        "Challenge": "RaceHorse",
                        "Level": "/Lotus/Levels/DevilTower/SpecialChallengeArena03.level",
                        "Specs": [],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHHorseAura",
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/DisableSelfReviveAura"
                        ]
                    },
                    {
                        "Index": 6,
                        "Type": "DT_COLLECTION",
                        "Challenge": "NC_MineField",
                        "Level": "/Lotus/Levels/DevilTower/ArenaPeach.level",
                        "Specs": [],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHMineFieldAura"
                        ]
                    },
                    {
                        "Index": 7,
                        "Type": "DT_PROTOFRAME",
                        "Challenge": "Wisp",
                        "Level": "/Lotus/Levels/DevilTower/ProtoframeRoomWisp.level",
                        "Specs": [],
                        "Auras": []
                    },
                    {
                        "Index": 8,
                        "Type": "DT_EXCAVATION",
                        "Challenge": "Manics",
                        "Level": "/Lotus/Levels/DevilTower/ArenaWaffle.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHManicSpec"
                        ],
                        "Auras": []
                    },
                    {
                        "Index": 9,
                        "Type": "DT_MIMICS",
                        "Challenge": "BasicMimics",
                        "Level": "/Lotus/Levels/DevilTower/ArenaAvocado.level",
                        "Specs": [],
                        "Auras": []
                    },
                    {
                        "Index": 10,
                        "Type": "DT_CAPTURE",
                        "Challenge": "Escapist",
                        "Level": "/Lotus/Levels/DevilTower/ArenaMelon.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHEntratiAlchemySpec"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHEscapistAura"
                        ]
                    },
                    {
                        "Index": 11,
                        "Type": "DT_SABOTAGE_DEFENSE",
                        "Challenge": "FreezeInShoot",
                        "Level": "/Lotus/Levels/DevilTower/ArenaCoconut.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/FiveFatesDefense"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/FreezeNShootEnhancementAura"
                        ]
                    },
                    {
                        "Index": 12,
                        "Type": "DT_RACE",
                        "Challenge": "BasicRace",
                        "Level": "/Lotus/Levels/DevilTower/ArenaWaffle.level",
                        "Specs": [],
                        "Auras": []
                    },
                    {
                        "Index": 13,
                        "Type": "DT_BREAK_TARGETS",
                        "Challenge": "NC_SecuritySpin",
                        "Level": "/Lotus/Levels/DevilTower/ArenaPeach.level",
                        "Specs": [],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHSecuritySpinAura"
                        ]
                    },
                    {
                        "Index": 14,
                        "Type": "DT_PROTOFRAME",
                        "Challenge": "Harrow",
                        "Level": "/Lotus/Levels/DevilTower/ProtoframeRoomHarrow.level",
                        "Specs": [],
                        "Auras": []
                    },
                    {
                        "Index": 15,
                        "Type": "DT_UNIQUE",
                        "Challenge": "HorseCombatOnly",
                        "Level": "/Lotus/Levels/DevilTower/SpecialChallengeArena02.level",
                        "Specs": [],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHHorseAura",
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/DisableSelfReviveAura"
                        ]
                    },
                    {
                        "Index": 16,
                        "Type": "DT_EXTERMINATE",
                        "Challenge": "NarmerPhobia",
                        "Level": "/Lotus/Levels/DevilTower/ArenaBagel.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHCorpusExterminateMixed"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHNarmerPhobiaAura"
                        ]
                    },
                    {
                        "Index": 17,
                        "Type": "DT_DEFENSE",
                        "Challenge": "HordeWeakpoints",
                        "Level": "/Lotus/Levels/DevilTower/ArenaAvocado.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHHordeSpec"
                        ],
                        "Auras": [
                            "/Lotus/Types/Gameplay/EntratiLab/LabConquest/GenericFortifiedFoesWeakpointAura"
                        ]
                    },
                    {
                        "Index": 18,
                        "Type": "DT_COLLECTION",
                        "Challenge": "NC_SpikeCeiling",
                        "Level": "/Lotus/Levels/DevilTower/ArenaEggplant.level",
                        "Specs": [],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHSpikeOrbAura"
                        ]
                    },
                    {
                        "Index": 19,
                        "Type": "DT_INTERCEPTION",
                        "Challenge": "JumpSmash",
                        "Level": "/Lotus/Levels/DevilTower/ArenaEggplant.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHVaniaScaldraTechrot"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/JumpSmashAura"
                        ]
                    },
                    {
                        "Index": 20,
                        "Type": "DT_LOOT",
                        "Challenge": "BasicLoot",
                        "Level": "/Lotus/Levels/DevilTower/ArenaCoconut.level",
                        "Specs": [],
                        "Auras": []
                    },
                    {
                        "Index": 21,
                        "Type": "DT_PROTOFRAME",
                        "Challenge": "Devil",
                        "Level": "/Lotus/Levels/DevilTower/BossArenaUriel.level",
                        "Specs": [],
                        "Auras": []
                    }
                ]
            },
            {
                "Activation": {
                    "$date": {
                        "$numberLong": "1780876800000"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1781481600000"
                    }
                },
                "RandSeed": 850192900,
                "Challenges": [
                    {
                        "Index": 1,
                        "Type": "DT_EXCAVATION",
                        "Challenge": "VoidAberration",
                        "Level": "/Lotus/Levels/DevilTower/ArenaMelon.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHGrineerExterminateFire"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/DarknessAura",
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHVoidAberrationAura"
                        ]
                    },
                    {
                        "Index": 2,
                        "Type": "DT_EXTERMINATE",
                        "Challenge": "FreezeInShoot",
                        "Level": "/Lotus/Levels/DevilTower/ArenaPeach.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/CorpusGrineerInvasionHard"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/FreezeNShootEnhancementAura"
                        ]
                    },
                    {
                        "Index": 3,
                        "Type": "DT_INFESTED_SALVAGE",
                        "Challenge": "PowerHouse",
                        "Level": "/Lotus/Levels/DevilTower/ArenaGrape.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHGrineerSealabExterminate"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/PowerHouseEnhancementAura"
                        ]
                    },
                    {
                        "Index": 4,
                        "Type": "DT_SABOTAGE_HIVE",
                        "Challenge": "UnseenFoes",
                        "Level": "/Lotus/Levels/DevilTower/ArenaCherry.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/CorpusGrineerMix"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHUnseenFoesAura"
                        ]
                    },
                    {
                        "Index": 5,
                        "Type": "DT_SABOTAGE_DEFENSE",
                        "Challenge": "Escapist",
                        "Level": "/Lotus/Levels/DevilTower/ArenaCherry.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHCorpusGasExterminateMixed"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHEscapistAura"
                        ]
                    },
                    {
                        "Index": 6,
                        "Type": "DT_PRESURE_GAUGE",
                        "Challenge": "GlassMaker",
                        "Level": "/Lotus/Levels/DevilTower/ArenaGrape.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHCorpusExterminateHumans"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/GlassMakerAura"
                        ]
                    },
                    {
                        "Index": 7,
                        "Type": "DT_PROTOFRAME",
                        "Challenge": "Wisp",
                        "Level": "/Lotus/Levels/DevilTower/ProtoframeRoomWisp.level",
                        "Specs": [],
                        "Auras": []
                    },
                    {
                        "Index": 8,
                        "Type": "DT_COLLECTION",
                        "Challenge": "NC_NarmerPhobia",
                        "Level": "/Lotus/Levels/DevilTower/ArenaGrape.level",
                        "Specs": [],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHNarmerPhobiaAura"
                        ]
                    },
                    {
                        "Index": 9,
                        "Type": "DT_ALCHEMY",
                        "Challenge": "Sunlight",
                        "Level": "/Lotus/Levels/DevilTower/ArenaAvocado.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHEntratiAlchemySpec"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/DarknessAura",
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/SunlightAura"
                        ]
                    },
                    {
                        "Index": 10,
                        "Type": "DT_MIMICS",
                        "Challenge": "BasicMimics",
                        "Level": "/Lotus/Levels/DevilTower/ArenaCherry.level",
                        "Specs": [],
                        "Auras": []
                    },
                    {
                        "Index": 11,
                        "Type": "DT_CAPTURE",
                        "Challenge": "HordeWeakpoints",
                        "Level": "/Lotus/Levels/DevilTower/ArenaGrape.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHHordeSpec"
                        ],
                        "Auras": [
                            "/Lotus/Types/Gameplay/EntratiLab/LabConquest/GenericFortifiedFoesWeakpointAura"
                        ]
                    },
                    {
                        "Index": 12,
                        "Type": "DT_NETRACELLS",
                        "Challenge": "ArbitrationDrones",
                        "Level": "/Lotus/Levels/DevilTower/ArenaCoconut.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/OrokinExterminateB"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHArbitrationSupportAura"
                        ]
                    },
                    {
                        "Index": 13,
                        "Type": "DT_SHRINE_DEFENSE",
                        "Challenge": "ShockingLeech",
                        "Level": "/Lotus/Levels/DevilTower/ArenaEggplant.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHCorpusZarimanExterminateSpec"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/ShockingLeechEnhancementAura"
                        ]
                    },
                    {
                        "Index": 14,
                        "Type": "DT_PROTOFRAME",
                        "Challenge": "Harrow",
                        "Level": "/Lotus/Levels/DevilTower/ProtoframeRoomHarrow.level",
                        "Specs": [],
                        "Auras": []
                    },
                    {
                        "Index": 15,
                        "Type": "DT_BOSS",
                        "Challenge": "Octopede",
                        "Level": "/Lotus/Levels/DevilTower/BossArenaSmall.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/EntratiLab/EntratiSwarmSpec"
                        ],
                        "Auras": []
                    },
                    {
                        "Index": 16,
                        "Type": "DT_INFESTED_SALVAGE",
                        "Challenge": "Sentients",
                        "Level": "/Lotus/Levels/DevilTower/ArenaWaffle.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHSentientSurvival"
                        ],
                        "Auras": []
                    },
                    {
                        "Index": 17,
                        "Type": "DT_COLLECTION",
                        "Challenge": "NC_SecuritySpin",
                        "Level": "/Lotus/Levels/DevilTower/ArenaEggplant.level",
                        "Specs": [],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHSecuritySpinAura"
                        ]
                    },
                    {
                        "Index": 18,
                        "Type": "DT_EXCAVATION",
                        "Challenge": "NarmerPhobia",
                        "Level": "/Lotus/Levels/DevilTower/ArenaBagel.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/VaniaExterminateScaldraNoBalloonSpec"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHNarmerPhobiaAura"
                        ]
                    },
                    {
                        "Index": 19,
                        "Type": "DT_LOOT_CREATURES",
                        "Challenge": "BasicLootCreatures",
                        "Level": "/Lotus/Levels/DevilTower/ArenaGrape.level",
                        "Specs": [],
                        "Auras": []
                    },
                    {
                        "Index": 20,
                        "Type": "DT_SABOTAGE_DEFENSE",
                        "Challenge": "ToxicFire",
                        "Level": "/Lotus/Levels/DevilTower/ArenaMelon.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHEntratiExterminateSpec"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/ToxicFireEnhancementAura"
                        ]
                    },
                    {
                        "Index": 21,
                        "Type": "DT_PROTOFRAME",
                        "Challenge": "Devil",
                        "Level": "/Lotus/Levels/DevilTower/BossArenaUriel.level",
                        "Specs": [],
                        "Auras": []
                    }
                ]
            },
            {
                "Activation": {
                    "$date": {
                        "$numberLong": "1781481600000"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1782086400000"
                    }
                },
                "RandSeed": 3634851737,
                "Challenges": [
                    {
                        "Index": 1,
                        "Type": "DT_DEFENSE",
                        "Challenge": "SecuritySpin",
                        "Level": "/Lotus/Levels/DevilTower/ArenaMango.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHEntratiAlchemySpec"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHSecuritySpinAura"
                        ]
                    },
                    {
                        "Index": 2,
                        "Type": "DT_NETRACELLS",
                        "Challenge": "JumpSmash",
                        "Level": "/Lotus/Levels/DevilTower/ArenaBagel.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/TauOrokinEmpireSpec"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/JumpSmashAura"
                        ]
                    },
                    {
                        "Index": 3,
                        "Type": "DT_RACE",
                        "Challenge": "BasicRace",
                        "Level": "/Lotus/Levels/DevilTower/ArenaAvocado.level",
                        "Specs": [],
                        "Auras": []
                    },
                    {
                        "Index": 4,
                        "Type": "DT_PRESURE_GAUGE",
                        "Challenge": "RocketsOnly",
                        "Level": "/Lotus/Levels/DevilTower/ArenaCherry.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHVaniaScaldraTechrot"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/RocketSpawnAura",
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/RocketsOnlyAura"
                        ]
                    },
                    {
                        "Index": 5,
                        "Type": "DT_CAPTURE",
                        "Challenge": "PoisonGas",
                        "Level": "/Lotus/Levels/DevilTower/ArenaCherry.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHGrineerExterminateFire"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/PoisonGasAura"
                        ]
                    },
                    {
                        "Index": 6,
                        "Type": "DT_UNIQUE",
                        "Challenge": "RaceHorse",
                        "Level": "/Lotus/Levels/DevilTower/SpecialChallengeArena02.level",
                        "Specs": [],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHHorseAura",
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/DisableSelfReviveAura"
                        ]
                    },
                    {
                        "Index": 7,
                        "Type": "DT_PROTOFRAME",
                        "Challenge": "Wisp",
                        "Level": "/Lotus/Levels/DevilTower/ProtoframeRoomWisp.level",
                        "Specs": [],
                        "Auras": []
                    },
                    {
                        "Index": 8,
                        "Type": "DT_COLLECTION",
                        "Challenge": "CollectionBasic",
                        "Level": "/Lotus/Levels/DevilTower/ArenaBagel.level",
                        "Specs": [],
                        "Auras": []
                    },
                    {
                        "Index": 9,
                        "Type": "DT_INFESTED_SALVAGE",
                        "Challenge": "RangedArcadiaOnly",
                        "Level": "/Lotus/Levels/DevilTower/ArenaAvocado.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHRangeOnlySpec"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHArcadeAutomataAura"
                        ]
                    },
                    {
                        "Index": 10,
                        "Type": "DT_SABOTAGE_DEFENSE",
                        "Challenge": "Sunlight",
                        "Level": "/Lotus/Levels/DevilTower/ArenaGrape.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHInfestedMicroplanet"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/DarknessAura",
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/SunlightAura"
                        ]
                    },
                    {
                        "Index": 11,
                        "Type": "DT_ALCHEMY",
                        "Challenge": "SpicyKnife",
                        "Level": "/Lotus/Levels/DevilTower/ArenaMango.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/VaniaExterminateTechrotSpec"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/SpicyKnifeAura"
                        ]
                    },
                    {
                        "Index": 12,
                        "Type": "DT_MIMICS",
                        "Challenge": "BasicMimics",
                        "Level": "/Lotus/Levels/DevilTower/ArenaEggplant.level",
                        "Specs": [],
                        "Auras": []
                    },
                    {
                        "Index": 13,
                        "Type": "DT_SABOTAGE_HIVE",
                        "Challenge": "VoidAberration",
                        "Level": "/Lotus/Levels/DevilTower/ArenaBagel.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/CorpusExterminateRobots"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/DarknessAura",
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHVoidAberrationAura"
                        ]
                    },
                    {
                        "Index": 14,
                        "Type": "DT_PROTOFRAME",
                        "Challenge": "Harrow",
                        "Level": "/Lotus/Levels/DevilTower/ProtoframeRoomHarrow.level",
                        "Specs": [],
                        "Auras": []
                    },
                    {
                        "Index": 15,
                        "Type": "DT_LOOT_CREATURES",
                        "Challenge": "BasicLootCreatures",
                        "Level": "/Lotus/Levels/DevilTower/ArenaPeach.level",
                        "Specs": [],
                        "Auras": []
                    },
                    {
                        "Index": 16,
                        "Type": "DT_PRESURE_GAUGE",
                        "Challenge": "SlipAndSlide",
                        "Level": "/Lotus/Levels/DevilTower/ArenaWaffle.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/CorpusGrineerMix"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHSlipAndSlideAura"
                        ]
                    },
                    {
                        "Index": 17,
                        "Type": "DT_SHRINE_DEFENSE",
                        "Challenge": "Manics",
                        "Level": "/Lotus/Levels/DevilTower/ArenaCoconut.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHManicSpec"
                        ],
                        "Auras": []
                    },
                    {
                        "Index": 18,
                        "Type": "DT_DEFENSE",
                        "Challenge": "ShockingLeech",
                        "Level": "/Lotus/Levels/DevilTower/ArenaCoconut.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Duviri/Arena/DuviriSurvivalSpecA"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/ShockingLeechEnhancementAura"
                        ]
                    },
                    {
                        "Index": 19,
                        "Type": "DT_NETRACELLS",
                        "Challenge": "GiantRealm",
                        "Level": "/Lotus/Levels/DevilTower/ArenaEggplant.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHGrineerSealabExterminate"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/GiantRealmAura"
                        ]
                    },
                    {
                        "Index": 20,
                        "Type": "DT_EXTERMINATE",
                        "Challenge": "GlassMaker",
                        "Level": "/Lotus/Levels/DevilTower/ArenaPeach.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/CorpusGrineerInvasionHard"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/GlassMakerAura"
                        ]
                    },
                    {
                        "Index": 21,
                        "Type": "DT_PROTOFRAME",
                        "Challenge": "Devil",
                        "Level": "/Lotus/Levels/DevilTower/BossArenaUriel.level",
                        "Specs": [],
                        "Auras": []
                    }
                ]
            },
            {
                "Activation": {
                    "$date": {
                        "$numberLong": "1782086400000"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1782691200000"
                    }
                },
                "RandSeed": 3128304089,
                "Challenges": [
                    {
                        "Index": 1,
                        "Type": "DT_COLLECTION",
                        "Challenge": "NC_SecuritySpin",
                        "Level": "/Lotus/Levels/DevilTower/ArenaCherry.level",
                        "Specs": [],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHSecuritySpinAura"
                        ]
                    },
                    {
                        "Index": 2,
                        "Type": "DT_EXTERMINATE",
                        "Challenge": "SpicyKnife",
                        "Level": "/Lotus/Levels/DevilTower/ArenaGrape.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHEntratiAlchemySpec"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/SpicyKnifeAura"
                        ]
                    },
                    {
                        "Index": 3,
                        "Type": "DT_MIMICS",
                        "Challenge": "BasicMimics",
                        "Level": "/Lotus/Levels/DevilTower/ArenaGrape.level",
                        "Specs": [],
                        "Auras": []
                    },
                    {
                        "Index": 4,
                        "Type": "DT_BREAK_TARGETS",
                        "Challenge": "NC_VoidAberration",
                        "Level": "/Lotus/Levels/DevilTower/ArenaEggplant.level",
                        "Specs": [],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/DarknessAura",
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHVoidAberrationAura"
                        ]
                    },
                    {
                        "Index": 5,
                        "Type": "DT_NETRACELLS",
                        "Challenge": "RocketsOnly",
                        "Level": "/Lotus/Levels/DevilTower/ArenaCherry.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/OrokinExterminateB"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/RocketSpawnAura",
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/RocketsOnlyAura"
                        ]
                    },
                    {
                        "Index": 6,
                        "Type": "DT_RACE",
                        "Challenge": "BasicRace",
                        "Level": "/Lotus/Levels/DevilTower/SpecialChallengeArena03.level",
                        "Specs": [],
                        "Auras": []
                    },
                    {
                        "Index": 7,
                        "Type": "DT_PROTOFRAME",
                        "Challenge": "Wisp",
                        "Level": "/Lotus/Levels/DevilTower/ProtoframeRoomWisp.level",
                        "Specs": [],
                        "Auras": []
                    },
                    {
                        "Index": 8,
                        "Type": "DT_SHRINE_DEFENSE",
                        "Challenge": "PoisonGas",
                        "Level": "/Lotus/Levels/DevilTower/ArenaBagel.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHPNWNarmerCorpusGasExterminate"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/PoisonGasAura"
                        ]
                    },
                    {
                        "Index": 9,
                        "Type": "DT_DEFENSE",
                        "Challenge": "GlassMaker",
                        "Level": "/Lotus/Levels/DevilTower/ArenaWaffle.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHInfestedExterminateMixed"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/GlassMakerAura"
                        ]
                    },
                    {
                        "Index": 10,
                        "Type": "DT_BOSS",
                        "Challenge": "CorruptedVor",
                        "Level": "/Lotus/Levels/DevilTower/ArenaGrape.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHGrineerNightwatchExterminate"
                        ],
                        "Auras": []
                    },
                    {
                        "Index": 11,
                        "Type": "DT_UNIQUE",
                        "Challenge": "RaceHorse",
                        "Level": "/Lotus/Levels/DevilTower/SpecialChallengeArena01.level",
                        "Specs": [],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHHorseAura",
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/DisableSelfReviveAura"
                        ]
                    },
                    {
                        "Index": 12,
                        "Type": "DT_ALCHEMY",
                        "Challenge": "FireAndIce",
                        "Level": "/Lotus/Levels/DevilTower/ArenaWaffle.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/Tau12MinWarDaxSpec"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/FireAndIceEnhancementAura"
                        ]
                    },
                    {
                        "Index": 13,
                        "Type": "DT_EXCAVATION",
                        "Challenge": "SlipAndSlide",
                        "Level": "/Lotus/Levels/DevilTower/ArenaAvocado.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Duviri/Arena/DuviriExterminateHardmodeA"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHSlipAndSlideAura"
                        ]
                    },
                    {
                        "Index": 14,
                        "Type": "DT_PROTOFRAME",
                        "Challenge": "Harrow",
                        "Level": "/Lotus/Levels/DevilTower/ProtoframeRoomHarrow.level",
                        "Specs": [],
                        "Auras": []
                    },
                    {
                        "Index": 15,
                        "Type": "DT_CAPTURE",
                        "Challenge": "UnseenFoes",
                        "Level": "/Lotus/Levels/DevilTower/ArenaGrape.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/VaniaExterminateScaldraNoBalloonSpec"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHUnseenFoesAura"
                        ]
                    },
                    {
                        "Index": 16,
                        "Type": "DT_SABOTAGE_DEFENSE",
                        "Challenge": "NarmerPhobia",
                        "Level": "/Lotus/Levels/DevilTower/ArenaPeach.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Narmer/PNWNarmerForestGrineerExterminate"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHNarmerPhobiaAura"
                        ]
                    },
                    {
                        "Index": 17,
                        "Type": "DT_BREAK_TARGETS",
                        "Challenge": "NC_NarmerPhobia",
                        "Level": "/Lotus/Levels/DevilTower/ArenaBagel.level",
                        "Specs": [],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHNarmerPhobiaAura"
                        ]
                    },
                    {
                        "Index": 18,
                        "Type": "DT_PRESURE_GAUGE",
                        "Challenge": "SecuritySpin",
                        "Level": "/Lotus/Levels/DevilTower/ArenaBagel.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHInfestedMicroplanet"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHSecuritySpinAura"
                        ]
                    },
                    {
                        "Index": 19,
                        "Type": "DT_LOOT_CREATURES",
                        "Challenge": "BasicLootCreatures",
                        "Level": "/Lotus/Levels/DevilTower/ArenaMelon.level",
                        "Specs": [],
                        "Auras": []
                    },
                    {
                        "Index": 20,
                        "Type": "DT_INTERCEPTION",
                        "Challenge": "GiantRealm",
                        "Level": "/Lotus/Levels/DevilTower/ArenaCherry.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/CorpusGrineerMix"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/GiantRealmAura"
                        ]
                    },
                    {
                        "Index": 21,
                        "Type": "DT_PROTOFRAME",
                        "Challenge": "Devil",
                        "Level": "/Lotus/Levels/DevilTower/BossArenaUriel.level",
                        "Specs": [],
                        "Auras": []
                    }
                ]
            },
            {
                "Activation": {
                    "$date": {
                        "$numberLong": "1782691200000"
                    }
                },
                "Expiry": {
                    "$date": {
                        "$numberLong": "1783296000000"
                    }
                },
                "RandSeed": 1912096315,
                "Challenges": [
                    {
                        "Index": 1,
                        "Type": "DT_DEFENSE",
                        "Challenge": "JadeGuardian",
                        "Level": "/Lotus/Levels/DevilTower/ArenaCherry.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/Tau12MinWarDaxSpec"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/JadeGuardianEnhancementAura"
                        ]
                    },
                    {
                        "Index": 2,
                        "Type": "DT_PRESURE_GAUGE",
                        "Challenge": "GrenadesOnly",
                        "Level": "/Lotus/Levels/DevilTower/ArenaMango.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHInfestedExterminateMixed"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/GrenadeSpawnAura",
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/GrenadesOnlyAura"
                        ]
                    },
                    {
                        "Index": 3,
                        "Type": "DT_SABOTAGE_HIVE",
                        "Challenge": "Sunlight",
                        "Level": "/Lotus/Levels/DevilTower/ArenaGrape.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Narmer/PNWNarmerForestGrineerExterminate"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/DarknessAura",
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/SunlightAura"
                        ]
                    },
                    {
                        "Index": 4,
                        "Type": "DT_EXCAVATION",
                        "Challenge": "VeryToxic",
                        "Level": "/Lotus/Levels/DevilTower/ArenaBagel.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHVaniaScaldraTechrot"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/ToxicLeechEnhancementAura"
                        ]
                    },
                    {
                        "Index": 5,
                        "Type": "DT_INTERCEPTION",
                        "Challenge": "MineField",
                        "Level": "/Lotus/Levels/DevilTower/ArenaWaffle.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHGrineerZarimanExterminate"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHMineFieldAura"
                        ]
                    },
                    {
                        "Index": 6,
                        "Type": "DT_SABOTAGE_DEFENSE",
                        "Challenge": "FireAndIce",
                        "Level": "/Lotus/Levels/DevilTower/ArenaEggplant.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Narmer/PNWNarmerDesertGrineerExterminate"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/FireAndIceEnhancementAura"
                        ]
                    },
                    {
                        "Index": 7,
                        "Type": "DT_PROTOFRAME",
                        "Challenge": "Wisp",
                        "Level": "/Lotus/Levels/DevilTower/ProtoframeRoomWisp.level",
                        "Specs": [],
                        "Auras": []
                    },
                    {
                        "Index": 8,
                        "Type": "DT_BREAK_TARGETS",
                        "Challenge": "NC_SecuritySpin",
                        "Level": "/Lotus/Levels/DevilTower/ArenaWaffle.level",
                        "Specs": [],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHSecuritySpinAura"
                        ]
                    },
                    {
                        "Index": 9,
                        "Type": "DT_MIMICS",
                        "Challenge": "BasicMimics",
                        "Level": "/Lotus/Levels/DevilTower/ArenaBagel.level",
                        "Specs": [],
                        "Auras": []
                    },
                    {
                        "Index": 10,
                        "Type": "DT_CAPTURE",
                        "Challenge": "HordeWeakpoints",
                        "Level": "/Lotus/Levels/DevilTower/ArenaMelon.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHHordeSpec"
                        ],
                        "Auras": [
                            "/Lotus/Types/Gameplay/EntratiLab/LabConquest/GenericFortifiedFoesWeakpointAura"
                        ]
                    },
                    {
                        "Index": 11,
                        "Type": "DT_PRESURE_GAUGE",
                        "Challenge": "RangedArcadiaOnly",
                        "Level": "/Lotus/Levels/DevilTower/ArenaCherry.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHRangeOnlySpec"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHArcadeAutomataAura"
                        ]
                    },
                    {
                        "Index": 12,
                        "Type": "DT_RACE",
                        "Challenge": "BasicRace",
                        "Level": "/Lotus/Levels/DevilTower/ArenaMango.level",
                        "Specs": [],
                        "Auras": []
                    },
                    {
                        "Index": 13,
                        "Type": "DT_EXTERMINATE",
                        "Challenge": "FieryTrailRollers",
                        "Level": "/Lotus/Levels/DevilTower/ArenaCoconut.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHRollerSpec"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/FieryTrailAura"
                        ]
                    },
                    {
                        "Index": 14,
                        "Type": "DT_PROTOFRAME",
                        "Challenge": "Harrow",
                        "Level": "/Lotus/Levels/DevilTower/ProtoframeRoomHarrow.level",
                        "Specs": [],
                        "Auras": []
                    },
                    {
                        "Index": 15,
                        "Type": "DT_UNIQUE",
                        "Challenge": "HorseCombatOnly",
                        "Level": "/Lotus/Levels/DevilTower/SpecialChallengeArena01.level",
                        "Specs": [],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/CoHHorseAura",
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/DisableSelfReviveAura"
                        ]
                    },
                    {
                        "Index": 16,
                        "Type": "DT_SABOTAGE_HIVE",
                        "Challenge": "Sentients",
                        "Level": "/Lotus/Levels/DevilTower/ArenaCoconut.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHSentientSurvival"
                        ],
                        "Auras": []
                    },
                    {
                        "Index": 17,
                        "Type": "DT_SABOTAGE_DEFENSE",
                        "Challenge": "FreezeInShoot",
                        "Level": "/Lotus/Levels/DevilTower/ArenaAvocado.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHDesertGrineerExterminate"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/FreezeNShootEnhancementAura"
                        ]
                    },
                    {
                        "Index": 18,
                        "Type": "DT_LOOT_CREATURES",
                        "Challenge": "BasicLootCreatures",
                        "Level": "/Lotus/Levels/DevilTower/ArenaPeach.level",
                        "Specs": [],
                        "Auras": []
                    },
                    {
                        "Index": 19,
                        "Type": "DT_CAPTURE",
                        "Challenge": "PowerHouse",
                        "Level": "/Lotus/Levels/DevilTower/ArenaGrape.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/Tau/CoHForestGrineerFairy"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/PowerHouseEnhancementAura"
                        ]
                    },
                    {
                        "Index": 20,
                        "Type": "DT_PRESURE_GAUGE",
                        "Challenge": "ToxicFire",
                        "Level": "/Lotus/Levels/DevilTower/ArenaGrape.level",
                        "Specs": [
                            "/Lotus/Types/Game/EnemySpecs/VaniaExterminateScaldraNoBalloonSpec"
                        ],
                        "Auras": [
                            "/Lotus/Types/Scripts/Tau/CoH/Complications/ToxicFireEnhancementAura"
                        ]
                    },
                    {
                        "Index": 21,
                        "Type": "DT_PROTOFRAME",
                        "Challenge": "Devil",
                        "Level": "/Lotus/Levels/DevilTower/BossArenaUriel.level",
                        "Specs": [],
                        "Auras": []
                    }
                ]
            }
        ],
        "Tmp": "{\"pgr\":{\"ts\":\"1732572900\",\"en\":\"CUSTOM DECALS @ ZEVILA\",\"fr\":\"DECALS CUSTOM @ ZEVILA\",\"it\":\"DECALCOMANIE PERSONALIZZATE @ ZEVILA\",\"de\":\"AUFKLEBER NACH WUNSCH @ ZEVILA\",\"es\":\"CALCOMANÍAS PERSONALIZADAS @ ZEVILA\",\"pt\":\"DECALQUES PERSONALIZADOS NA ZEVILA\",\"ru\":\"ПОЛЬЗОВАТЕЛЬСКИЕ НАКЛЕЙКИ @ ЗеВиЛа\",\"pl\":\"NOWE NAKLEJKI @ ZEVILA\",\"uk\":\"КОРИСТУВАЦЬКІ ДЕКОЛІ @ ЗІВІЛА\",\"tr\":\"ÖZEL ÇIKARTMALAR @ ZEVILA\",\"ja\":\"カスタムデカール @ ゼビラ\",\"zh\":\"定制贴花认准泽威拉\",\"ko\":\"커스텀 데칼 @ ZEVILA\",\"tc\":\"自訂貼花 @ ZEVILA\",\"th\":\"รูปลอกสั่งทำที่ ZEVILA\"},\"mbrt\":true,\"fbst\":{\"a\":1780272000,\"e\":1780279200,\"n\":1780300800},\"Skt\":\"an:2;ios:2;ps:2;xb:2;sw:1;otr:2\",\"sfn\":550}"
    };

    describe('worldFromJson', () => {
        it('应该正确解析 JSON 数据', () => {
            const result = worldFromJson(mockWorldData);

            expect(result).toBeDefined();
        });

        it('应该正确解析 基本字段', () => {
            const world = worldFromJson(mockWorldData);
            expect(world).toBeDefined();

            const alert = world.alerts[0];
            // console.log(alert.missionInfo.missionReward);
            expect(alert.tag).toBe('JadeShadows');
            expect(alert.icon).toBe('/Lotus/Interface/Icons/WorldStatePanel/JadeShadowsEventBadge.png');
            expect(alert.forceUnlock).toBe(false);
            expect(alert.missionInfo.missionType).toBe('MT_MOBILE_DEFENSE');
            expect(alert.missionInfo.missionReward.countedItems?.[0].itemType).toBe('/Lotus/Types/Gameplay/JadeShadows/Resources/AscensionEventResourceItem');

            const activeMission = world.activeMissions[0];
            expect(activeMission.missionType).toBe('MT_DEFENSE');
            expect(activeMission.modifier).toBe('VoidT2');
        });
    });

    describe('worldToJson', () => {
        it('应该正确转换为 JSON 格式', () => {
            const world = worldFromJson(mockWorldData);
            const json = worldToJson(world);
            const alert = json.alerts[0];
            expect(json).toBeDefined();
            expect(alert.activation).toBeDefined();
            expect(alert.expiry).toBeDefined();
            expect(alert.missionInfo).toBeDefined();
            expect(alert.tag).toBe('JadeShadows');
            expect(alert.icon).toBe('/Lotus/Interface/Icons/WorldStatePanel/JadeShadowsEventBadge.png');

            const activeMission = json.activeMissions[0];
            expect(activeMission.missionType).toBe('MT_DEFENSE');
        });
    });
})