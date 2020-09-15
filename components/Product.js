import React from 'react';
import {View, Text, Image, Dimensions, StyleSheet} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const imageWidth = (65 / 100) * windowWidth;
import ProductMRPRealm from '../database/productmrp/productmrp.operations';
import SalesChannelRealm from '../database/sales-channels/sales-channels.operations';

export default function Product({item, route}) {
  const image = item.base64encodedImage;
  const {salesChannelId} = route.params;

  const getItemPrice = () => {
    const salesChannel = SalesChannelRealm.getSalesChannelFromName(
      SalesChannelRealm.getSalesChannelFromId(salesChannelId).name,
    );
    if (salesChannel) {
      const productMrp = ProductMRPRealm.getFilteredProductMRP()[
        ProductMRPRealm.getProductMrpKeyFromIds(item.productId, salesChannel.id)
      ];
      if (productMrp) {
        return productMrp.priceAmount;
      }
    }
    return item.priceAmount;
  };
  return (
    <View>
      <Image
        source={{
          height: 150,
          width: imageWidth / 4,
          flex: 1,
          uri: image,
        }}
      />
      <Text style={styles.text}>
        {item.priceCurrency}:{getItemPrice()}
      </Text>
      <Text style={styles.text}>{item.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
