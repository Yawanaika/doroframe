// const SpIncursionsCard = memo(function SpIncursionsCard()) {
//     return null;
// }
//
// export function SpIncursionsList() {
//     const { data, isPending, isError, error } = useSpIncursionsQuery();
//     if (isPending) return <CardSkeleton />;
//     if (isError) return <CardError message={String(error)} />;
//     if (!data || !Object.keys(data).length)
//         return <CardEmpty text="无赏金轮换" />;
//     return <SpIncursionsCard cycle={data} />;
// }