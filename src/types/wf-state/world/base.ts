export interface Base {
    id?: string;
    activation?: string;
    expiry?: string;
}

export const asOid = (v: any): string | undefined => v?.$oid;

export const asDateMs = (v: any): string | undefined => v?.$date?.$numberLong;

export function parseBase(json: any): Base {
    return {
        id: asOid(json?._id) ?? "",
        activation: asDateMs(json?.Activation) ?? "",
        expiry: asDateMs(json?.Expiry),
    };
}

export function serializeBase(b: Base) {
    return {
        id: b.id,
        activation: b.activation,
        expiry: b.expiry,
    };
}
