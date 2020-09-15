import React from 'react';
import {View, Text, Image, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Details({detail, clearDetail}) {
  console.log('detail', detail);

  if (detail === null) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text
          style={{
            fontSize: 20,
            textTransform: 'uppercase',
            fontWeight: 'bold',
          }}>
          Empty
        </Text>
      </View>
    );
  } else {
    return (
      <View>
        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
          <View>
            <Text>{new Date(detail.createdAt).toDateString()}</Text>
            <Text>{detail.customerAccount.name}</Text>
          </View>
          <View>
            <Icon.Button
              onPress={clearDetail}
              name="close"
              size={40}
              color="red"
              backgroundColor="transparent"
              solid
            />
          </View>
        </View>
        {detail.receiptLineItems === undefined ? (
          <View>
            <Text>top up</Text>
          </View>
        ) : (
          <View>
            <ScrollView>
              {detail.receiptLineItems.map((item) => {
                const image = item.product.base64encodedImage;
                const key = item.id;

                return (
                  <View key={key}>
                    <Text style={{fontSize: 12}}>
                      {new Date(item.created_at).toDateString()}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <Image
                        source={{
                          height: 130,
                          width: 150,
                          flex: 1,
                          uri: image,
                        }}
                      />
                      <Text style={{fontSize: 12}}>
                        {item.product.description}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>
    );
  }
  // if (detail === null || detail === undefined) {
  //   return (
  //     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
  //       <Text
  //         style={{
  //           fontSize: 20,
  //           textTransform: 'uppercase',
  //           fontWeight: 'bold',
  //         }}>
  //         Empty
  //       </Text>
  //     </View>
  //   );
  // } else {
  //   return (
  //     <View>
  //       <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
  //         <View>
  //           <Text></Text>
  //         </View>
  //         <View>
  //           <Icon.Button
  //             onPress={clearDetail}
  //             name="close"
  //             size={40}
  //             color="red"
  //             backgroundColor="transparent"
  //             solid
  //           />
  //         </View>
  //       </View>
  //       <View>
  //         <Text style={{fontWeight: 'bold'}}>Products</Text>
  //       </View>
  //       <ScrollView>
  //         {detail.map((item) => {
  //           const image = item.product.base64encodedImage;
  //           const key = item.id;

  //           return (
  //             <View key={key}>
  //               <Text style={{fontSize: 12}}>
  //                 {new Date(item.created_at).toDateString()}
  //               </Text>
  //               <View style={{flexDirection: 'row'}}>
  //                 <Image
  //                   source={{
  //                     height: 130,
  //                     width: 150,
  //                     flex: 1,
  //                     uri: image,
  //                   }}
  //                 />
  //                 <Text style={{fontSize: 12}}>{item.product.description}</Text>
  //               </View>
  //             </View>
  //           );
  //         })}
  //       </ScrollView>
  //     </View>
  //   );
  // }
}
