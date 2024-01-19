import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification, Bell } from "web3uikit";
// import { Bell } from "web3uikit/icons";

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;
    const dispatch = useNotification();
    const [entranceFee, setEntranceFee] = useState("0");
    const [numPlayers, setNumPlayers] = useState("0");
    const [recentWinner, setRecentWinner] = useState("0");

    const { runContractFunction: enterRaffle, isLoading, isFetching } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee
    });

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {}
    });

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {}
    });

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {}
    });

    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString();
        const numPlayersFromCall = (await getNumberOfPlayers()).toString();
        const recentWinnerFromCall = (await getRecentWinner()).toString();
        // console.log("entranceFeeFromContract: ", entranceFeeFromCall);
        setEntranceFee(entranceFeeFromCall);
        setNumPlayers(numPlayersFromCall);
        setRecentWinner(recentWinnerFromCall);
    }

    useEffect(() => {
        if (isWeb3Enabled) {


            updateUI();
        }
    }, [isWeb3Enabled]);

    const handleSuccess = async function (tx) {
        await tx.wait(1);
        handleNewNotification(tx);
        await updateUI();
    }

    const BellIcon = () => {
        return <Bell fontSize={20} />;
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Tx notification",
            position: "topR",
            icon: <BellIcon />
        })
    }

    return (<div>
        Hi From Lottery Entrance!
        {raffleAddress ? (<div>
            <button onClick={async function () {
                await enterRaffle({
                    onSuccess: handleSuccess,
                    onError: (e) => console.log(e)
                });
            }} disabled={isLoading || isFetching}>Enter Raffle</button>
            Entrance Fee: {ethers.formatEther(entranceFee, "ether").toString()} ETH
            <div>
                Number of players: {numPlayers}
                Recent Winner: {recentWinner}
            </div>
        </div>) : <div>
            No Raffle address detected
        </div>}

    </div>);
}