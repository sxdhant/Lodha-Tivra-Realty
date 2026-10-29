import Image from 'next/image';

// The Bengaluru skyline line drawing beside the Projects heading. Decorative, desktop only.
export function Monument() {
  return (
    <figure className="monument">
      <Image src="/bengaluru-skyline-v2.png" alt="Illustration of the Bengaluru skyline" width={873} height={358} sizes="40rem" />
    </figure>
  );
}
