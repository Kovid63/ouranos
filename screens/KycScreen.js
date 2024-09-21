import { ProgressView } from '@react-native-community/progress-view'
import { doc, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Image, PermissionsAndroid, ScrollView, StatusBar, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import RNFS from 'react-native-fs'
import { launchImageLibrary } from 'react-native-image-picker'
import { Camera, useCameraDevices } from 'react-native-vision-camera'
import { UserContext } from '../App'
import { auth, db, storage } from '../Firebase'



const KycScreen = ({navigation}) => {

    const[cameraActive, setCameraActive] = useState(true)
    const[selfie, setSelfie] = useState('')
    const[imageFront, setImageFront] = useState(require('../assets/cameraOutline.png'))
    const[imageBack, setImageBack] = useState(require('../assets/cameraOutline.png'))
    const[step, setStep] = useState(1)
    const[isDown, setDown] = useState(false)
    const[type, setType] = useState('Choose your gender')
    const{globalType} = useContext(UserContext)
    const[pan, setPan] = useState('')
    const[name, setName] = useState('')
    const[address, setAddress] = useState('')
    const[age, setAge] = useState('')
    const[gender, setGender] = useState('')
    const[state, setState] = useState('')
    const[loading, setLoading] = useState(false)
    const[button, setButton] = useState(true)
    const[bank, setBank] = useState({bankName: '', bankAccount: '', reBankAccount: '', ifsc: '', })


    const camera = useRef(null)


    const arr = [
        {
           // name: 'Click Selfie',
            name: '1',
            heading: 'Photo ID',
        },
        {
            //name: 'ID proof',
            name: '2',
            heading: 'Enter Document Details',
        },
        {
            //name: 'Personal Details',
            name: '3',
            heading: 'Enter Account Details',
        },
    ]

    const data = [
        {
            name: 'Male',
        },
        {
            name: 'Female',
        },
        {
            name: 'Others',
        },
    ]

   

    const devices = useCameraDevices()
    const device = devices.front

    const getCameraPermission = async() => {
        const cameraPermission = await Camera.getCameraPermissionStatus()
        const newCameraPermission = await Camera.requestCameraPermission()
        const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
        const permissionR = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
    }

    const openLibraryFront = () =>  {
        launchImageLibrary('image', (res) => { res.didCancel? null:(res.assets.forEach((doc) =>  {
        setImageFront({uri: doc.uri})
      }))})
     }

     const openLibraryBack = () =>  {
        launchImageLibrary('image', (res) => { res.didCancel? null:(res.assets.forEach((doc) =>  {
        setImageBack({uri: doc.uri})
       
      }))})
     }


    const uploadDocument = async(uri_front, uri_back) => {
        setLoading(true)
        const storageRefFront = ref(storage, auth.currentUser.email+'/PAN_Front.jpg')
        const imgFront = await fetch(uri_front)
        const bytesFront = await imgFront.blob()
        await uploadBytes(storageRefFront, bytesFront).then((snapshot) =>{
            getDownloadURL(snapshot.ref).then((url) => [setImageFront(url),console.log(url)])
        })

        const storageRefBack = ref(storage, auth.currentUser.email+'/PAN_Back.jpg')
        const imgBack = await fetch(uri_back)
        const bytesBack = await imgBack.blob()
        await uploadBytes(storageRefBack, bytesBack).then((snapshot) =>{
            getDownloadURL(snapshot.ref).then((url)=> [setImageBack(url),console.log(url),setStep(step+1),setLoading(false)])
        })

    }


    const clickPhoto = async() => {
        const photo = await camera.current.takePhoto({
            flash: 'on'
          })
        return photo;
    }

    const photosave = () => {
        setLoading(true)
        clickPhoto().then((photo) => {
            setSelfie('file://'+ photo.path)
            setLoading(false)
            setCameraActive(false)
            setButton(false)
        })
    }


    const uploadSelfie = async() => {
      setLoading(true)
      const newPath = RNFS.ExternalDirectoryPath + '/selfie.jpg'
        RNFS.moveFile(selfie, newPath).then(async()=> {
           console.log(newPath)
           const storageRef = ref(storage, auth.currentUser.email+'/selfie.jpg')
           const img = await fetch('file://'+newPath)
           const bytes = await img.blob()
            await uploadBytes(storageRef, bytes).then((snapshot) =>{
                getDownloadURL(snapshot.ref).then((url) => [setSelfie(url), console.log(url), setStep(step+1), setLoading(false), setButton(true)])
            })
        }).catch((e) => console.log(e))
    }


    const uploadAccountDetails = async() => {
        if(name == ''|| address == ''|| age.length == 0 ||state == ''|| gender == ''){
            ToastAndroid.show('Fill all fields.', ToastAndroid.SHORT)
            return;
        }
        if(bank.bankAccount != bank.reBankAccount || bank.bankAccount.length < 5){
            ToastAndroid.show("Bank account number doesn't match or is invalid", ToastAndroid.SHORT)
            return;
        }
        setLoading(true)
        const docRef = (doc(db,globalType, auth.currentUser.email))
        updateDoc(docRef, {
            kyc: true,
            kycDetails:{
                    selfie: selfie,
                    pan_front: imageFront,
                    pan_back: imageBack,
                    PAN: pan,
                    name: name,
                    address: address,
                    age: age,
                    state: state,
                    gender: gender,
                    bankAccount: bank.bankAccount,
                    bankName: bank.bankName,
                    bankIfsc: bank.ifsc,
                },
            verified: false,

        }).then(() => {
            setLoading(false)
            navigation.replace('WaitScreen')
        })

    }

    useEffect(() => {
        getCameraPermission()
    },[])



    if (device == null) {
        return <></>;
      }

     
    

  return (
    <>
        <View style={{marginTop: '15%'}}>
        <StatusBar translucent backgroundColor={'transparent'}></StatusBar>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: '5%'}}>
            <TouchableOpacity onPress={() => {navigation.goBack()}}>
                <Image source={require('../assets/arrow-left.png')} style={{height: 30, width: 30}}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {step > 1 ? [setStep(step-1), setButton(false)] : <></> }}>
                <Image source={require('../assets/cancel.png')} style={{height: 20, width: 20, marginRight: '3%'}}/>
            </TouchableOpacity>
        </View>
        <Text style={{color: 'black', fontSize: 26, fontWeight: '500', marginTop: '5%', marginLeft: '8%'}}>Upload KYC</Text>
        </View>
        <View style={{flexDirection: 'row', marginTop: '5%', paddingHorizontal: '3%'}}>
        {arr.map((progress, index) => (
            <View key={index} style={{flex: 1, alignItems: 'center'}}>
                    <Text style={{color:  step < index + 1 ? 'grey': 'teal', fontWeight: '600'}}>{progress.name}</Text> 
                        <View style={{height: 5, width: '80%', margin: 5, backgroundColor: step < index + 1 ? 'grey' : 'teal', borderRadius: 5}}>
                        </View>
            </View>
        ))
        }
    </View>
    <View style={{flex: 1,backgroundColor: 'white', height: '100%', overflow: 'hidden',marginTop: '5%', borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 1, borderColor: '#cfcfcf'}}>
       { loading? <ProgressView progressTintColor={'teal'} isIndeterminate style={{marginTop: '-2.0%'}}/> :  <></>}
        { step == 1 ? <> 
        <Text style={{color: 'black', margin: '5%', fontSize: 22, fontWeight: '700'}}>{arr[step-1].heading}</Text>
        <Camera
        style={{height: '50%', width: '80%', alignSelf: 'center', backgroundColor: 'transparent', marginTop: '5%'}}
        device={device}
        ref={camera}
        isActive={cameraActive}
        photo={true}
        />
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '30%', marginTop: '10%'}}>
        <TouchableOpacity onPress={() => {button? photosave():<></>}} style={{alignItems: 'center'}}>
            <Image style={{height: 40, width: 40}} source={require('../assets/camera.png')}/>
            <Text style={{color: 'black', marginTop:'5%',fontWeight: '700'}}>Click</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {[setCameraActive(true), setButton(true)]}} style={{alignItems: 'center'}}>
            <Image style={{height: 40, width: 40}} source={require('../assets/refresh.png')}/>
            <Text style={{color: 'black', marginTop:'5%', fontWeight: '700'}}>Re-Take</Text>
        </TouchableOpacity>
        </View>
        {<TouchableOpacity onPress={() => {button? <></>: [setCameraActive(false), uploadSelfie()]}} style={[styles.SignUp, {alignSelf: 'center',  marginRight: '8%', marginTop: '10%', backgroundColor: 'black', height: 40, width: '80%'}]}>
            <View>
                <Text style={styles.signUpText}>Next</Text>
            </View>
        </TouchableOpacity>}
        </>:<></>}
        {  step == 2? 
        <>
            <Text style={{color: 'black', margin: '5%', fontSize: 22, fontWeight: '700'}}>{arr[step-1].heading}</Text>
            <ScrollView>
            <View style={{marginLeft: '5%'}}>
                <Text style={styles.field}>PAN</Text>
                <View style={[styles.fieldContainer]}>
                    <TextInput style={{color: 'black', width: '100%'}} placeholder={'Enter your PAN card number'} placeholderTextColor={'grey'} onChangeText={(value) => {setPan(value)}}/>
                </View>
            </View>
            <Text style={{color: 'black', marginLeft: '5%', marginTop: '8%',fontSize: 22, fontWeight: '700'}}>Photo Proof</Text>
            <Text style={{color: 'grey', fontSize: 18, fontWeight: '500', paddingHorizontal: '5%', marginTop: '2%'}}>Take photo on a plain dark surface and make sure the documents are visible.</Text>
            <View style={{marginTop: '8%', flexDirection: 'row', height: '22%', justifyContent: 'space-between', paddingHorizontal: '10%'}}>
                <TouchableOpacity onPress={() => {openLibraryFront()}} style={{backgroundColor: 'white', width: '35%', borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderColor: 'grey', borderWidth: 1}}>
                    <Image source={imageFront} style={{height: 50, width: 60}}/>
                    <Text style={{color: 'black', marginTop:'5%',fontWeight: '700'}}>Front</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {openLibraryBack()}} style={{backgroundColor: 'white', width: '35%', borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderColor: 'grey', borderWidth: 1}}>
                    <Image source={imageBack} style={{height: 50, width: 60}}/>
                    <Text style={{color: 'black', marginTop:'5%',fontWeight: '700'}}>Back</Text>
                </TouchableOpacity>
            </View>
            {imageFront != require('../assets/cameraOutline.png') && imageBack != require('../assets/cameraOutline.png')? <TouchableOpacity onPress={() => {pan.length < 10? ToastAndroid.show('Invalid PAN!', ToastAndroid.SHORT):[uploadDocument(imageFront.uri, imageBack.uri)]}} style={[styles.SignUp, {alignSelf: 'center',  marginRight: '8%', marginTop: '10%', backgroundColor: 'black', height: 40, width: '80%', marginBottom: '3%'}]}>
                <View>
                    <Text style={styles.signUpText}>Next</Text>
                </View>
            </TouchableOpacity>:<></>}
        </ScrollView>
        </>
        :<></> 

        }
        { step == 3? <>
            <Text style={{color: 'black', margin: '5%', fontSize: 22, fontWeight: '700'}}>{arr[step-1].heading}</Text>
            <ScrollView keyboardShouldPersistTaps={'handled'}>
            <View style={{marginLeft: '5%'}}>
                <Text style={styles.field}>Name</Text>
                <View style={[styles.fieldContainer]}>
                    <TextInput style={{color: 'black', width: '100%'}} placeholder={'Enter your Name'} placeholderTextColor={'grey'} onChangeText={(value) => {setName(value)}}/>
                </View>
            </View>
            <View style={{marginLeft: '5%'}}>
                <Text style={styles.field}>Bank Name</Text>
                <View style={[styles.fieldContainer]}>
                    <TextInput style={{color: 'black', width: '100%'}} placeholder={"Enter your bank's name"} placeholderTextColor={'grey'} onChangeText={(value) => {setBank({...bank, bankName: value})}}/>
                </View>
            </View>
            <View style={{marginLeft: '5%'}}>
                <Text style={styles.field}>Bank Account Number</Text>
                <View style={[styles.fieldContainer]}>
                    <TextInput style={{color: 'black', width: '100%'}} placeholder={'Enter your bank account number'} placeholderTextColor={'grey'} secureTextEntry onChangeText={(value) => {setBank({...bank, bankAccount: value})}}/>
                </View>
            </View>
            <View style={{marginLeft: '5%'}}>
                <Text style={styles.field}>Re-enter Bank Account Number</Text>
                <View style={[styles.fieldContainer]}>
                    <TextInput style={{color: 'black', width: '100%'}} placeholder={'Re-enter your bank account number'} placeholderTextColor={'grey'} onChangeText={(value) => {setBank({...bank, reBankAccount: value})}}/>
                </View>
            </View>
            <View style={{marginLeft: '5%'}}>
                <Text style={styles.field}>IFSC Code</Text>
                <View style={[styles.fieldContainer]}>
                    <TextInput style={{color: 'black', width: '100%'}} placeholder={"Enter your bank's IFSC code"} placeholderTextColor={'grey'} onChangeText={(value) => {setBank({...bank, ifsc: value})}}/>
                </View>
            </View>
            <View style={{marginLeft: '5%'}}>
                <Text style={styles.field}>Address</Text>
                <View style={[styles.fieldContainer]}>
                    <TextInput style={{color: 'black', width: '100%'}} placeholder={'Enter your Address'} placeholderTextColor={'grey'} onChangeText={(value) => {setAddress(value)}}/>
                </View>
            </View>
            <View style={{marginLeft: '5%'}}>
                <Text style={styles.field}>State</Text>
                <View style={[styles.fieldContainer]}>
                    <TextInput style={{color: 'black', width: '100%'}} placeholder={'Enter your State'} placeholderTextColor={'grey'} onChangeText={(value) => {setState(value)}}/>
                </View>
            </View>
            <View style={{marginLeft: '5%'}}>
                <Text style={styles.field}>Age</Text>
                <View style={[styles.fieldContainer]}>
                    <TextInput keyboardType='number-pad' style={{color: 'black', width: '100%'}} placeholder={'Enter your Age'} placeholderTextColor={'grey'} onChangeText={(value) => {setAge(value)}}/>
                </View>
            </View>
            <View style={{marginLeft: '5%'}}>
            <Text style={styles.field}>Gender</Text>
            <View style={[styles.fieldContainer]}>
                <TouchableOpacity onPress={() => {isDown? setDown(false):setDown(true)}}>
                    <Image source={require('../assets/down-arrow.png')} style={{height: 20, width: 20}}/>
                </TouchableOpacity>
                    <Text style={{color: 'grey', marginLeft: '2%'}}>{gender}</Text>
            </View>
            {isDown? data.map((type,index) => (<View key={index} style={{height: 50, width: '90%', justifyContent: 'center', borderColor: 'black', borderWidth: 0.5}}>
            <Text onPress={()=> {[setGender(type.name), setDown(false)]}} style={{color: 'black', marginLeft: '10%', paddingHorizontal: '1%'}}>{type.name}</Text>
        </View>)):<></>}
        </View>
        <TouchableOpacity onPress={() => {[uploadAccountDetails()]}} style={[styles.SignUp, {alignSelf: 'center',  marginRight: '8%', marginTop: '10%', backgroundColor: 'black', height: 40, width: '80%',marginBottom: '10%'}]}>
            <View>
                <Text style={[styles.signUpText]}>Submit</Text>
            </View>
        </TouchableOpacity>
       </ScrollView>
        </>: <></>
        }
    </View>
    </>
  )
}

const styles = StyleSheet.create({
    SignUp: {
      backgroundColor: 'teal',
      height: 30,
      width: '40%',
      marginTop: '10%',
      marginLeft: '8%',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
  },
  
  signUpText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '500',
  },

  field:{
    marginTop: '3%',
    color: 'black',
    fontSize: 15,
    fontWeight: '600',
},

fieldContainer:{
    width: '90%',
    marginTop: '3%',
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
},

})


export default KycScreen