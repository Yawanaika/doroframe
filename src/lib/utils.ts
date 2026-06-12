import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {useTranslation} from "react-i18next";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function dayOfYearTo1999Date( i:number) {
  // 检查输入是否合法
  if (i < 1 || i > 365) return;
  
  // 1999年不是闰年，所以2月有28天
  const daysInMonths = [
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
  
  const monthNames = [
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
  
  const [t] = useTranslation("month")
  
  let dayCount = 0;
  for (let month = 0; month < daysInMonths.length; month++) {
    if (i <= dayCount + daysInMonths[month]) {
      const dayOfMonth = i - dayCount;
      return `${t(monthNames[month])} ${dayOfMonth}日`;
    }
    dayCount += daysInMonths[month];
  }
  
  // 理论上不会到达这里
  return;
}
