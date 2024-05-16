mod helper;

use frame_metadata::v15::RuntimeMetadataV15;
use frame_metadata::{RuntimeMetadata, RuntimeMetadataPrefixed};
use merkleized_metadata::{
    generate_metadata_digest, generate_proof_for_extrinsic_parts, ExtraInfo, ExtrinsicMetadata,
    FrameMetadataPrepared, Proof, SignedExtrinsicData
};
use neon::prelude::*;
use parity_scale_codec::{Decode, Encode};
use crate::helper::get_parts_len_from_tx_blob;
use frame_metadata_hash_extension::CheckMetadataHash;

#[derive(Encode)]
pub struct MetadataProof {
    proof: Proof,
    extrinsic: ExtrinsicMetadata,
    extra_info: ExtraInfo,
}

fn get_extra_info<'a>(
    cx: &mut impl Context<'a>,
    js_props: Handle<'a, JsObject>,
) -> NeonResult<ExtraInfo> {
    let base58_prefix = js_props
        .get_value(cx, "base58Prefix")?
        .downcast::<JsNumber, _>(cx)
        .unwrap()
        .value(cx) as u16;
    let decimals = js_props
        .get_value(cx, "decimals")?
        .downcast::<JsNumber, _>(cx)
        .unwrap()
        .value(cx) as u8;
    let token_symbol = js_props
        .get_value(cx, "tokenSymbol")?
        .downcast::<JsString, _>(cx)
        .unwrap()
        .value(cx);
    let spec_name = js_props
        .get_value(cx, "specName")?
        .downcast::<JsString, _>(cx)
        .unwrap()
        .value(cx);
    let spec_version = js_props
        .get_value(cx, "specVersion")?
        .downcast::<JsNumber, _>(cx)
        .unwrap()
        .value(cx) as u32;
    Ok(ExtraInfo {
        base58_prefix,
        decimals,
        token_symbol,
        spec_name,
        spec_version,
    })
}


fn get_short_metadata_from_tx_blob(mut cx: FunctionContext) -> JsResult<JsString> {
    let param_obj = cx.argument::<JsObject>(0).unwrap();
    let tx_blob = param_obj
        .get_value(&mut cx, "txBlob")?
        .downcast::<JsString, _>(&mut cx)
        .unwrap()
        .value(&mut cx);
    let metadata_str = param_obj
        .get_value(&mut cx, "metadata")?
        .downcast::<JsString, _>(&mut cx)
        .unwrap()
        .value(&mut cx);
    let js_props = param_obj
        .get_value(&mut cx, "props")?
        .downcast::<JsObject, _>(&mut cx)
        .unwrap();
    let specs = get_extra_info(&mut cx, js_props)?;
    // The crate accepts now call data. We don't have to fake the signature info
    let tx_blob = hex::decode(tx_blob).unwrap();


    let metadata = hex::decode(metadata_str).unwrap();
    let runtime_meta_v15 = RuntimeMetadataV15::decode(&mut &metadata[5..]).unwrap();
    let runtime_meta = RuntimeMetadata::V15(runtime_meta_v15);

    let parts_lens =
        match get_parts_len_from_tx_blob(&tx_blob, &runtime_meta) {
            Ok(x) => x,
            Err(x) => return Ok(cx.string(x)),
        };

    let call_data = tx_blob[0..parts_lens[0]].to_vec();
    let se_included_in_extrinsic = tx_blob[parts_lens[0]..parts_lens[0] + parts_lens[1]].to_vec();
    let se_included_in_signed_data = tx_blob[parts_lens[0] + parts_lens[1]..].to_vec();

    let sig_ext = SignedExtrinsicData {
        included_in_signed_data: &se_included_in_signed_data,
        included_in_extrinsic: &se_included_in_extrinsic,
    };
    let registry_proof =
        match generate_proof_for_extrinsic_parts(&call_data, Some(sig_ext), &runtime_meta) {
            Ok(x) => x,
            Err(x) => return Ok(cx.string(x)),
        };

    // Generates extrinsic_metadata in the same way the crate does
    let extrinsic_metadata = FrameMetadataPrepared::prepare(
        &RuntimeMetadataPrefixed::decode(&mut &metadata[..])
            .unwrap()
            .1,
    )
        .unwrap()
        .as_type_information()
        .unwrap()
        .extrinsic_metadata;

    let meta_proof = MetadataProof {
        proof: registry_proof,
        extrinsic: extrinsic_metadata,
        extra_info: specs,
    };
    Ok(cx.string(hex::encode(meta_proof.encode())))
}

fn get_metadata_digest(mut cx: FunctionContext) -> JsResult<JsString> {
    let param_obj = cx.argument::<JsObject>(0).unwrap();
    let metadata_str = param_obj
        .get_value(&mut cx, "metadata")?
        .downcast::<JsString, _>(&mut cx)
        .unwrap()
        .value(&mut cx);
    let js_props = param_obj
        .get_value(&mut cx, "props")?
        .downcast::<JsObject, _>(&mut cx)
        .unwrap();
    let extra_info = get_extra_info(&mut cx, js_props)?;
    let metadata = hex::decode(metadata_str).unwrap();
    let runtime_meta_v15 = RuntimeMetadataV15::decode(&mut &metadata[5..]).unwrap();
    let runtime_meta = RuntimeMetadata::V15(runtime_meta_v15);

    let digest = match generate_metadata_digest(&runtime_meta, extra_info) {
        Ok(x) => hex::encode(x.hash()),
        Err(x) => x,
    };
    Ok(cx.string(digest))
}

fn get_check_metadata_hash_ext(mut cx: FunctionContext) -> JsResult<JsString> {
  let param_obj = cx.argument::<JsObject>(0).unwrap();
  let metadata_str = param_obj
    .get_value(&mut cx, "metadata")?
    .downcast::<JsString, _>(&mut cx)
    .unwrap()
    .value(&mut cx);
  let js_props = param_obj
    .get_value(&mut cx, "props")?
    .downcast::<JsObject, _>(&mut cx)
    .unwrap();
  let extra_info = get_extra_info(&mut cx, js_props)?;
  let metadata = hex::decode(metadata_str).unwrap();
  let runtime_meta_v15 = RuntimeMetadataV15::decode(&mut &metadata[5..]).unwrap();
  let runtime_meta = RuntimeMetadata::V15(runtime_meta_v15);

  let digest =  generate_metadata_digest(&runtime_meta, extra_info).unwrap();

  Ok(cx.string(hex::encode(CheckMetadataHash::<>::new_with_custom_hash(digest.hash()).encode())))
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("getShortMetadataFromTxBlob", get_short_metadata_from_tx_blob)?;
    cx.export_function("getMetadataDigest", get_metadata_digest)?;
    cx.export_function("getCheckMetadataHashExtension", get_check_metadata_hash_ext)?;
    Ok(())
}
