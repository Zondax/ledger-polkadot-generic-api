use frame_metadata::v15::RuntimeMetadataV15;
use metadata_shortener::{
    cut_metadata_transaction_unmarked,
    traits::{Blake3Leaf, HashableMetadata},
    ShortSpecs,
};
use neon::prelude::*;
use parity_scale_codec::{Decode, Encode};

fn get_specs<'a>(
    cx: &mut impl Context<'a>,
    js_props: Handle<'a, JsObject>,
) -> NeonResult<ShortSpecs> {
    let base58prefix = js_props
        .get_value(cx, "base58prefix")?
        .downcast::<JsNumber, _>(cx)
        .unwrap()
        .value(cx) as u16;
    let decimals = js_props
        .get_value(cx, "decimals")?
        .downcast::<JsNumber, _>(cx)
        .unwrap()
        .value(cx) as u8;
    let unit = js_props
        .get_value(cx, "unit")?
        .downcast::<JsString, _>(cx)
        .unwrap()
        .value(cx);
    Ok(ShortSpecs {
        base58prefix,
        decimals,
        unit,
    })
}

fn get_short_metadata(mut cx: FunctionContext) -> JsResult<JsString> {
    let param_obj = cx.argument::<JsObject>(0).unwrap();
    let blob_str = param_obj
        .get_value(&mut cx, "blob")?
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
    let specs = get_specs(&mut cx, js_props)?;
    let blob = hex::decode(blob_str).unwrap();
    let metadata = hex::decode(metadata_str).unwrap();

    let meta_v15 = RuntimeMetadataV15::decode(&mut &metadata[5..]).unwrap();
    let short_metadata_str = match cut_metadata_transaction_unmarked::<_, _, Blake3Leaf, _>(
        &blob.as_ref(),
        &mut (),
        &meta_v15,
        &specs,
    ) {
        Ok(x) => hex::encode(x.encode()),
        Err(_) => String::from(""),
    };
    Ok(cx.string(short_metadata_str))
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
    let specs = get_specs(&mut cx, js_props)?;
    let metadata = hex::decode(metadata_str).unwrap();

    let meta_v15 = RuntimeMetadataV15::decode(&mut &metadata[5..]).unwrap();
    let digest = match <RuntimeMetadataV15 as HashableMetadata<()>>::digest_with_short_specs(
        &meta_v15,
        &specs,
        &mut (),
    ) {
        Ok(x) => hex::encode(x.encode()),
        Err(_) => String::from(""),
    };
    Ok(cx.string(digest))
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("getShortMetadata", get_short_metadata)?;
    cx.export_function("getMetadataDigest", get_metadata_digest)?;
    Ok(())
}
