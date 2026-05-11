export function toDummyEmail(name: string): string {
  if (/^[a-zA-Z0-9._-]+$/.test(name)) return `${name}@shadowfriend.app`;
  const hex = Array.from(new TextEncoder().encode(name))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return `${hex}@shadowfriend.app`;
}
