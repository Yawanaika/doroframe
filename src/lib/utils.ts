import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {useTranslation} from "react-i18next";
import {Item} from "@/types/wf-market";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const DAYS_IN_MONTH = [
    31, // 一月
    28, // 二月
    31, // 三月
    30, // 四月
    31, // 五月
    30, // 六月
    31, // 七月
    31, // 八月
    30, // 九月
    31, // 十月
    30, // 十一月
    31, // 十二月
];

export const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]

export function dayOfYearTo1999Date( i:number) {
  // 检查输入是否合法
  if (i < 1 || i > 365) return;
  
  // 1999年不是闰年，所以2月有28天
  const [t] = useTranslation("month")
  
  let dayCount = 0;
  for (let month = 0; month < DAYS_IN_MONTH.length; month++) {
    if (i <= dayCount + DAYS_IN_MONTH[month]) {
      const dayOfMonth = i - dayCount;
      return `${t(MONTH_NAMES[month])} ${dayOfMonth}日`;
    }
    dayCount += DAYS_IN_MONTH[month];
  }
  
  // 理论上不会到达这里
  return;
}

export function getSumEndo(item: Item | undefined, amberStars?: number, cyanStars?: number): number{
    if(item && item.baseEndo && item.endoMultiplier){
        let sumEndo =  (item.baseEndo + 100 * (amberStars ?? 0) + 50 * (cyanStars ?? 0))
            * (1 + item.endoMultiplier * ((amberStars ?? 0) + (cyanStars ?? 0)) / ((item?.maxCyanStars ?? 0 ) + (item?.maxAmberStars ?? 0)))
        return Math.round(sumEndo);
    }
    return 0 ;
}
