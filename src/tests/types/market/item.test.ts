import {describe, expect, it} from "vitest";
import {itemFromJson, itemToJson} from "@/types/wf-market";

describe ("item", () => {
    const itemRaw = {
            "id": "56783f24cbfa8f0432dd899c",
            "slug": "frost_prime_set",
            "gameRef": "/Lotus/Powersuits/Frost/FrostPrime",
            "tags": [
                "set",
                "prime",
                "warframe"
            ],
            "setRoot": true,
            "setParts": [
                "54a73e65e779893a797fff80",
                "54a73e65e779893a797fff7d",
                "54a73e65e779893a797fff6c",
                "56783f24cbfa8f0432dd899c",
                "54a73e65e779893a797fff79"
            ],
            "ducats": 175,
            "reqMasteryRank": 0,
            "tradingTax": 8000,
            "tradable": true,
            "i18n": {
                "zh-hans": {
                    "name": "Frost Prime 一套",
                    "description": "Frost Prime 拥有与 Frost 一样的急冻技能，但自带独特的 Mod 极性槽，可提供更优秀的自定义空间。",
                    "wikiLink": "https://wiki.warframe.com/w/Frost_Prime",
                    "icon": "items/images/en/frost_prime_set.4f8ff8605be1afaab9a0e5cc3c67cb21.png",
                    "thumb": "items/images/en/thumbs/frost_prime_set.4f8ff8605be1afaab9a0e5cc3c67cb21.128x128.png"
                },
                "en": {
                    "name": "Frost Prime Set",
                    "description": "Frost Prime has the same chilling abilities as Frost but provides unique mod polarities, allowing for greater customization.",
                    "wikiLink": "https://wiki.warframe.com/w/Frost_Prime",
                    "icon": "items/images/en/frost_prime_set.4f8ff8605be1afaab9a0e5cc3c67cb21.png",
                    "thumb": "items/images/en/thumbs/frost_prime_set.4f8ff8605be1afaab9a0e5cc3c67cb21.128x128.png"
                }
            }
        }
    describe("itemFromJson", () => {
        it('应该正确解析 JSON 数据', () => {
            const result = itemFromJson(itemRaw);
            expect(result).toBeDefined();
        });
    })
    
    describe("itemToJson", () => {
        it('应该正确转换为 JSON 数据', () => {
            const result = itemFromJson(itemRaw);
            const json = itemToJson(result);
            console.log(json);
            expect(json).toBeDefined();
            expect(json.i18n.zhHans.name).toBe('Frost Prime 一套');
        });
    })
    
});