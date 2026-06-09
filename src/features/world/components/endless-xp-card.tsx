import { memo } from "react";
import type { EndlessXpChoice } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { useEndlessXpChoicesQuery } from "@/features/world/queries";
import { tr, trImage } from "@/lib/wpep";
import { cn } from "@/lib/utils";

const WARFRAME_ICON =
    "/Lotus/Interface/Icons/StoreIcons/Warframes/{}.png";
const INCARNON_UNLOCKER_ICON =
    "/Lotus/Interface/Icons/StoreIcons/Weapons/IncarnonWeapons/{}IncarnonAdapter.png";
const INCARNON_UNLOCKER_NAME =
    "/Lotus/Language/Weapons/{}IncarnonUnlockerName";

const EXC_NORMAL = "EXC_NORMAL";

// 普通：紫色 / 战甲；钢铁：琥珀色 / Incarnon 武器（对齐 doroprime endless_xp_choice.dart）
function choiceMeta(category: string, name: string) {
    if (category === EXC_NORMAL) {
        return {
            icon: trImage(WARFRAME_ICON.replace("{}", name)),
            title: tr(name) || name,
            accent: "text-purple-300",
        };
    }
    return {
        // Incarnon 图标路径去掉 Solo/And；字典名 key 保留原始 choice
        icon: trImage(
            INCARNON_UNLOCKER_ICON.replace("{}", name)
                .replace("Solo", "")
                .replace("And", ""),
        ),
        title: tr(INCARNON_UNLOCKER_NAME.replace("{}", name)),
        accent: "text-amber-300",
    };
}

const ChoiceRow = memo(function ChoiceRow({
    choice,
}: {
    choice: EndlessXpChoice;
}) {
    const title =
        choice.category === EXC_NORMAL ? "无尽回廊" : "无尽回廊 (钢铁)";
    return (
        <EventCard title={title}>
            <div className="flex gap-2 overflow-x-auto pb-1">
                {choice.choice.map((c) => {
                    const { icon, title: name, accent } = choiceMeta(
                        choice.category,
                        c,
                    );
                    return (
                        <div
                            key={c}
                            className="relative h-40 w-28 shrink-0 overflow-hidden rounded-md"
                        >
                            <img
                                src="/images/endless/bg.png"
                                alt=""
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                            <img
                                src={icon}
                                alt={name}
                                loading="lazy"
                                className="absolute inset-0 m-auto h-24 w-24 object-contain"
                            />
                            <div
                                className={cn(
                                    "absolute inset-x-1 bottom-1 text-center text-xs font-bold drop-shadow",
                                    accent,
                                )}
                            >
                                {name}
                            </div>
                        </div>
                    );
                })}
            </div>
        </EventCard>
    );
});

export function EndlessXpList() {
    const { data, isPending, isError, error } = useEndlessXpChoicesQuery();
    if (isPending) return <CardSkeleton />;
    if (isError) return <CardError message={String(error)} />;
    if (!data?.length) return <CardEmpty text="无无尽回廊" />;
    return (
        <div className="grid gap-3 md:grid-cols-2">
            {data.map((c) => (
                <ChoiceRow key={c.id} choice={c} />
            ))}
        </div>
    );
}
