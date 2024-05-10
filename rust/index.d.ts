import { ChainProps } from "../src/types";

export interface RootHashParams {
  metadata: string;
  props: ChainProps;
}

export interface MetadataParams extends RootHashParams {
  callData: string;
  seIncludedInExtrinsic: string;
  seIncludedInSignedData: string;
}
export interface MetadataParamsTxBlob extends RootHashParams {
  txBlob: string;
}

export declare function getShortMetadataFromTxBlob(params: MetadataParamsTxBlob): string;
export declare function getShortMetadata(params: MetadataParams): string;
export declare function getMetadataDigest(params: RootHashParams): string;
