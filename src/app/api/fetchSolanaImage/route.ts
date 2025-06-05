import { Connection, PublicKey } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mintAddress = searchParams.get("mintAddress");

    if (!mintAddress) {
      return new Response(
        JSON.stringify({ error: "mintAddress parameter is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const connection = new Connection("https://api.mainnet-beta.solana.com");
    const metaplex = Metaplex.make(connection);

    const publicKey = new PublicKey(mintAddress);
    const token = await metaplex.nfts().findByMint({ mintAddress: publicKey });
    const tokenLogo = token.json?.image;

    return new Response(JSON.stringify({ image: tokenLogo }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching Solana token image:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch token image", image: null }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
