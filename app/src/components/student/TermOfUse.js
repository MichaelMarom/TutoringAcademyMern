import { useEffect } from "react";

const TermOfUse = () => {
   /* useEffect(() => {
        let next = document.querySelector('.student-next')

        if(next && next.hasAttribute('id')){
            next?.removeAttribute('id');
        }
    }, [])*/
    return ( 

        <>
            <div className="form-term-of-use">

                <div className="term-of-use-cnt">
                    Mobile apps are rarely made up of a single screen. Managing the presentation of, and transition between, multiple screens is typically handled by what is known as a navigator.

                    This guide covers the various navigation components available in React Native. If you are getting started with navigation, you will probably want to use React Navigation. React Navigation provides a straightforward navigation solution, with the ability to present common stack navigation and tabbed navigation patterns on both Android and iOS.

                    If you're integrating React Native into an app that already manages navigation natively, or looking for an alternative to React Navigation, the following library provides native navigation on both platforms: react-native-navigation.
                    Mobile apps are rarely made up of a single screen. Managing the presentation of, and transition between, multiple screens is typically handled by what is known as a navigator.

                    This guide covers the various navigation components available in React Native. If you are getting started with navigation, you will probably want to use React Navigation. React Navigation provides a straightforward navigation solution, with the ability to present common stack navigation and tabbed navigation patterns on both Android and iOS.

                    If you're integrating React Native into an app that already manages navigation natively, or looking for an alternative to React Navigation, the following library provides native navigation on both platforms: react-native-navigation.
                    Mobile apps are rarely made up of a single screen. Managing the presentation of, and transition between, multiple screens is typically handled by what is known as a navigator.

                    This guide covers the various navigation components available in React Native. If you are getting started with navigation, you will probably want to use React Navigation. React Navigation provides a straightforward navigation solution, with the ability to present common stack navigation and tabbed navigation patterns on both Android and iOS.

                    If you're integrating React Native into an app that already manages navigation natively, or looking for an alternative to React Navigation, the following library provides native navigation on both platforms: react-native-navigation.
                    Mobile apps are rarely made up of a single screen. Managing the presentation of, and transition between, multiple screens is typically handled by what is known as a navigator.

                    This guide covers the various navigation components available in React Native. If you are getting started with navigation, you will probably want to use React Navigation. React Navigation provides a straightforward navigation solution, with the ability to present common stack navigation and tabbed navigation patterns on both Android and iOS.

                    If you're integrating React Native into an app that already manages navigation natively, or looking for an alternative to React Navigation, the following library provides native navigation on both platforms: react-native-navigation.
                </div>

                <div className="agreement" style={{display: 'block', position: 'relative', padding: '45px'}}>
                    

                    <div style={{display: 'flex', margin: '0 0 5px 0', width: '300px', whiteSpace: 'nowrap'}}>
                        <input type="checkbox" id="e-level" style={{float: 'left'}} />
                        
                        <span style={{margin: ' 0 10px 15px 10px'}} htmlFor="e-level">By selecting this box i have agreed to the terms and conditions of use</span>
                    </div>

                    <div style={{display: 'flex', margin: '0 0 5px 0', width: '300px', whiteSpace: 'nowrap'}}>
                        <input type="checkbox" id="e-level" style={{float: 'left'}} />
                        
                        <span style={{margin: ' 0 10px 15px 10px'}} htmlFor="e-level">I will provide my social security number when my account accummulates $50 (For American Citizens Only)</span>
                    </div>

                    <div style={{display: 'flex', margin: '0 0 5px 0', width: '300px', whiteSpace: 'nowrap'}}>
                        <input type="checkbox" id="e-level" style={{float: 'left'}} />
                        
                        <span style={{margin: ' 0 10px 15px 10px'}} htmlFor="e-level">Tutoring academy will issue me from 1009 when my account will exceed $600</span>
                    </div>

                </div>

            </div>
        </>
     );
}
 
export default TermOfUse;