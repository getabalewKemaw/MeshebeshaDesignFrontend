import ChatClient from '@/components/Chat/ChatClient';

export default async function Page({ params }: { params: { productId: string } | Promise<{ productId: string }> }) {
  // `params` can be a Promise in some Next.js configurations. Await it to
  // ensure we have a concrete `productId` string to pass into the client
  // component. This avoids the "params is a Promise" runtime error.
  const resolved = await params;
  const productId: string = resolved?.productId;

  return <ChatClient productId={productId} />;
}
