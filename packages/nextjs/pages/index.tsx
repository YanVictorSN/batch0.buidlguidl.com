import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";
import { Spinner } from "~~/components/assets/Spinner";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth/useScaffoldContractRead";

const Home: NextPage = () => {
  const account = useAccount();

  const { data: checkedInCount } = useScaffoldContractRead({
    contractName: "BatchRegistry",
    functionName: "checkedInCounter",
    watch: true,
  });

  const { data: isInAllowList } = useScaffoldContractRead({
    contractName: "BatchRegistry",
    functionName: "allowList",
    args: [account.address],
    watch: true,
  });

  const { data: checkedInContract } = useScaffoldContractRead({
    contractName: "BatchRegistry",
    functionName: "yourContractAddress",
    args: [account.address],
    watch: true,
  });

  const isZeroAddress = (address: string) => {
    return address === "0x0000000000000000000000000000000000000000";
  };

  const loadingSpinner = <span className="loading loading-spinner loading-xs" />;

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Batch 0</span>
          </h1>
          <p className="text-lg flex gap-2 justify-center">
            <span className="font-bold">Checked in builders count:</span>
            <span> {checkedInCount?.toString() ?? loadingSpinner}</span>
          </p>
        </div>

        {/* Showing Account Status */}
        {isInAllowList !== undefined ? (
          <div className="text-center">
            <p>
              Account status:{" "}
              <span className={isInAllowList ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                {isInAllowList ? "Allowed" : "Not allowed"}
              </span>
            </p>
            {isInAllowList && (
              <p>
                Check-in Status:{" "}
                <span
                  className={
                    isZeroAddress(checkedInContract as string) ? "text-red-400 font-bold" : "text-green-400 font-bold"
                  }
                >
                  {isZeroAddress(checkedInContract as string) ? "Not Checked In" : "Checked In"}
                </span>
              </p>
            )}
          </div>
        ) : (
          <Spinner />
        )}

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contract
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
