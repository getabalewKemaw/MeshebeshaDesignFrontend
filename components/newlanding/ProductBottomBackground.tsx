'use client';

import Image from 'next/image';

export default function ProductBottomBackground() {
    return (
        <div className="w-full relative bg-white">
            {/* Desktop Background */}
            <div className="hidden md:block w-full">
                <Image
                    src="/productdetilbottombg.png"
                    alt="Footer Background"
                    width={1920}
                    height={400}
                    className="w-full h-auto object-cover"
                    priority
                />
            </div>

            {/* Mobile Background */}
            <div className="md:hidden w-full">
                <Image
                    src="/productdetailmobilebottom.png"
                    alt="Footer Background Mobile"
                    width={800}
                    height={300}
                    className="w-full h-auto object-cover"
                    priority
                />
            </div>
        </div>
    );
}
