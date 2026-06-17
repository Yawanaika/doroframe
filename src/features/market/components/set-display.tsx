import type { Item, SetInfo } from "@/types/wf-market";
import { useSettingsStore } from "@/store/settings";
import { itemDisplayName, itemIconUrl } from "../assets";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Props {
    setInfo: SetInfo | undefined;
    slug: string;
    onSelect: (slug: string, name: string) => void;
    isLoading: boolean;
}

/** 套装展示：左主件 + 右部件网格，点击切换查询 */
export function SetDisplay({ setInfo, slug, onSelect, isLoading }: Props) {
    const lang = useSettingsStore((s) => s.lang);

    if (isLoading) {
        return <Skeleton className="size-28 rounded-full" />;
    }
    if (!setInfo || setInfo.items.length === 0) return null;

    const main =
        setInfo.items.find((it) => it.setRoot) ?? setInfo.items[0];
    const parts = setInfo.items.filter((it) => !it.setRoot && it.id !== main.id);

    const pick = (it: Item) => onSelect(it.slug, itemDisplayName(it, lang));

    const Circle = ({
        item,
        size,
        sub,
    }: {
        item: Item;
        size: number;
        sub: boolean;
    }) => {
        const selected = item.slug === slug;
        return (
            <button
                type="button"
                onClick={() => pick(item)}
                className="relative shrink-0"
                title={itemDisplayName(item, lang)}
            >
                <span
                    className={cn(
                        "block overflow-hidden rounded-full border bg-muted transition-all",
                        selected
                            ? "border-primary ring-2 ring-primary"
                            : "border-border hover:border-primary",
                    )}
                    style={{ width: size, height: size }}
                >
                    <img
                        src={itemIconUrl(item, lang, sub)}
                        alt={itemDisplayName(item, lang)}
                        className="size-full object-contain"
                    />
                </span>
                {sub && (item.quantityInSet ?? 1) > 1 && (
                    <span className="absolute -bottom-1 -right-1 rounded-md border border-primary/40 bg-foreground px-1 text-[9px] font-bold text-background">
                        x{item.quantityInSet}
                    </span>
                )}
            </button>
        );
    };

    if (parts.length === 0) {
        return (
            <div className="flex items-center justify-center">
                <Circle item={main} size={96} sub={false} />
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <Circle item={main} size={96} sub={false} />
            <div className="grid grid-cols-3 gap-2">
                {parts.map((p) => (
                    <Circle key={p.id} item={p} size={48} sub />
                ))}
            </div>
        </div>
    );
}
