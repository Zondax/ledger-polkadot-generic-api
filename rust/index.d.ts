import { ChainProps } from "../src/types";

export interface RootHashParams {
  metadata: string;
  props: ChainProps;
}

export interface MetadataParams extends RootHashParams {
  blob: string;
}

export declare function getShortMetadata(params: MetadataParams): string;
export declare function getMetadataDigest(params: RootHashParams): string;
