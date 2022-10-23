/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { USElection, USElectionInterface } from "../USElection";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "winner",
        type: "uint256",
      },
    ],
    name: "LogElectionEnded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint8",
        name: "winner",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "stateSeats",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "string",
        name: "state",
        type: "string",
      },
    ],
    name: "LogStateResult",
    type: "event",
  },
  {
    inputs: [],
    name: "BIDEN",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TRUMP",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currentLeader",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "electionEnded",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "endElection",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "presidentId",
        type: "uint8",
      },
    ],
    name: "getPresidentSeats",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "resultsSubmitted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    name: "seats",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "votesBiden",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "votesTrump",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "stateSeats",
            type: "uint8",
          },
        ],
        internalType: "struct USElection.StateResult",
        name: "result",
        type: "tuple",
      },
    ],
    name: "submitStateResult",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50600080546001600160a01b031916331790556108b3806100326000396000f3fe608060405234801561001057600080fd5b506004361061009e5760003560e01c8063713d87c511610066578063713d87c5146101135780638da5cb5b14610126578063ac4bd53a1461013b578063c94ca9e314610143578063e494a8831461014b5761009e565b80632d78d8e5146100a357806337ad98ec146100c157806359f78468146100e15780636167215e146100eb57806369b36bd41461010b575b600080fd5b6100ab61015e565b6040516100b891906107a3565b60405180910390f35b6100d46100cf366004610550565b610163565b6040516100b89190610675565b6100e9610183565b005b6100fe6100f9366004610630565b610233565b6040516100b8919061079a565b6100ab61024b565b6100ab610121366004610630565b610250565b61012e610265565b6040516100b89190610661565b6100ab610274565b6100d4610343565b6100e96101593660046105f1565b610353565b600281565b805160208183018101805160028252928201919093012091525460ff1681565b6000546001600160a01b031633146101b65760405162461bcd60e51b81526004016101ad90610763565b60405180910390fd5b600054600160a01b900460ff16156101e05760405162461bcd60e51b81526004016101ad906106c8565b6000805460ff60a01b1916600160a01b1790557faacb23683ec1a0e9b52f9a6264edf58ad322ac62079d65ea7363a2d400f439f461021c610274565b60405161022991906107a3565b60405180910390a1565b60ff9081166000908152600160205260409020541690565b600181565b60016020526000908152604090205460ff1681565b6000546001600160a01b031681565b600160208190527fd9d16d34ffb15ba3a3d852f0d403e2ce1d691fb54de27ac87cd2f993f3ec330f5460009182527fcc69885fda6bcc1a4ace058b4a62bf5e179ea78fd58a1ccd71c22cc9b688792f5460ff918216911611156102d957506001610340565b60016020527fcc69885fda6bcc1a4ace058b4a62bf5e179ea78fd58a1ccd71c22cc9b688792f5460026000527fd9d16d34ffb15ba3a3d852f0d403e2ce1d691fb54de27ac87cd2f993f3ec330f5460ff9182169116111561033c57506002610340565b5060005b90565b600054600160a01b900460ff1681565b6000546001600160a01b0316331461037d5760405162461bcd60e51b81526004016101ad90610763565b600054600160a01b900460ff16156103a75760405162461bcd60e51b81526004016101ad906106c8565b60006103b96080830160608401610630565b60ff16116103d95760405162461bcd60e51b81526004016101ad9061072e565b8060400135816020013514156104015760405162461bcd60e51b81526004016101ad906106ff565b600261040d82806107ea565b60405161041b929190610651565b9081526040519081900360200190205460ff161561044b5760405162461bcd60e51b81526004016101ad90610680565b600081604001358260200135111561046557506001610469565b5060025b6104796080830160608401610630565b60ff80831660009081526001602052604081208054909261049c91859116610836565b92506101000a81548160ff021916908360ff160217905550600160028380600001906104c891906107ea565b6040516104d6929190610651565b908152604051908190036020019020805491151560ff1990921691909117905560ff81167fa2e71fe38f1afa3762cf9d2ea7bb6a4d272a90fd6f9392f3acedd3b542046b4661052b6080850160608601610630565b61053585806107ea565b604051610544939291906107b1565b60405180910390a25050565b60006020808385031215610562578182fd5b823567ffffffffffffffff80821115610579578384fd5b818501915085601f83011261058c578384fd5b81358181111561059e5761059e610867565b604051601f8201601f19168101850183811182821017156105c1576105c1610867565b60405281815283820185018810156105d7578586fd5b818585018683013790810190930193909352509392505050565b600060208284031215610602578081fd5b813567ffffffffffffffff811115610618578182fd5b820160808185031215610629578182fd5b9392505050565b600060208284031215610641578081fd5b813560ff81168114610629578182fd5b6000828483379101908152919050565b6001600160a01b0391909116815260200190565b901515815260200190565b60208082526028908201527f5468697320737461746520726573756c742077617320616c7265616479207375604082015267626d69747465642160c01b606082015260800190565b6020808252601e908201527f54686520656c656374696f6e2068617320656e64656420616c72656164790000604082015260600190565b60208082526015908201527454686572652063616e6e6f7420626520612074696560581b604082015260600190565b6020808252818101527f537461746573206d7573742068617665206174206c6561737420312073656174604082015260600190565b60208082526018908201527f4e6f7420696e766f6b656420627920746865206f776e65720000000000000000604082015260600190565b90815260200190565b60ff91909116815260200190565b600060ff851682526040602083015282604083015282846060840137818301606090810191909152601f909201601f1916010192915050565b6000808335601e19843603018112610800578283fd5b83018035915067ffffffffffffffff82111561081a578283fd5b60200191503681900382131561082f57600080fd5b9250929050565b600060ff821660ff84168060ff0382111561085f57634e487b7160e01b83526011600452602483fd5b019392505050565b634e487b7160e01b600052604160045260246000fdfea2646970667358221220d6801f41e20a57e7df53e11d31811dec1d1fad8dda2ea9686218522a588a79bc64736f6c63430008000033";

type USElectionConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: USElectionConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class USElection__factory extends ContractFactory {
  constructor(...args: USElectionConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<USElection> {
    return super.deploy(overrides || {}) as Promise<USElection>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): USElection {
    return super.attach(address) as USElection;
  }
  connect(signer: Signer): USElection__factory {
    return super.connect(signer) as USElection__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): USElectionInterface {
    return new utils.Interface(_abi) as USElectionInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): USElection {
    return new Contract(address, _abi, signerOrProvider) as USElection;
  }
}
