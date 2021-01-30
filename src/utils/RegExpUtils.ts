export function matchAll<R>(
    re: RegExp,
    payload: string,
    handler: (matched: RegExpExecArray) => R,
) {
    const items: R[] = [];
    let matched;
    // tslint:disable-next-line:no-conditional-assignment
    while (matched = re.exec(payload)) {
        items.push(handler(matched));
    }
    return items;
}
