// 紫卡卡面预览：在 RivenTemplate 底图上叠加武器名、Mod 名、词条、极性与段位/循环。
// 叠层偏移沿用 doroprime 参考实现（基于 200×267 的卡面），文字色 #D6C8FF。

import { useTranslation } from "react-i18next";
import { RotateCcwIcon } from "lucide-react";

interface Props {
    /** 武器本地化名 */
    weaponName: string;
    /** 生成的 Mod 名 */
    modName: string;
    /** 极性 code（madurai/naramon/vazarin），决定右上角图标 */
    polarity: string;
    /** 词条文本行（已含正负号/单位/名称） */
    stats: string[];
    /** 精通段位 */
    masteryRank: string;
    /** 循环次数 */
    reRolls: string;
}

const PURPLE = "#D6C8FF";

export function RivenCardPreview({
    weaponName,
    modName,
    polarity,
    stats,
    masteryRank,
    reRolls,
}: Props) {
    const { t } = useTranslation();
    return (
        <div className="relative shrink-0" style={{ width: 200, aspectRatio: "3 / 4" }}>
            <img
                src="/images/RivenTemplate.webp"
                alt=""
                className="absolute inset-0 size-full object-contain"
            />
            {polarity && (
                <img
                    src={`/images/polarity/POLARITY_${polarity}.png`}
                    alt=""
                    style={{ position: "absolute", top: 32, right: 28, width: 12, height: 12 }}
                />
            )}
            <div
                style={{
                    position: "absolute",
                    top: 126,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    color: PURPLE,
                    fontSize: 14,
                    fontWeight: 600,
                }}
            >
                {weaponName}
            </div>
            <div
                style={{
                    position: "absolute",
                    top: 142,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    color: PURPLE,
                    fontSize: 14,
                }}
            >
                {modName}
            </div>
            <div
                style={{
                    position: "absolute",
                    top: 162,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    color: PURPLE,
                    fontSize: 10,
                    fontWeight: 500,
                    lineHeight: 1.2,
                }}
            >
                {stats.map((s, i) => (
                    <div key={i}>{s}</div>
                ))}
            </div>
            <div
                style={{
                    position: "absolute",
                    bottom: 37,
                    left: 34,
                    right: 34,
                    display: "flex",
                    justifyContent: "space-between",
                    color: PURPLE,
                    fontSize: 8,
                }}
            >
                <span>
                    {t("auction.preview.mastery")} {masteryRank}
                </span>
                <span className="flex items-center gap-0.5">
                    <RotateCcwIcon style={{ width: 10, height: 10 }} />
                    {reRolls}
                </span>
            </div>
        </div>
    );
}
