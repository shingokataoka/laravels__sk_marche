import { usePage } from '@inertiajs/react';

import * as React from 'react';
import { Fade } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import nl2br from '@/Functions/nl2br';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function hide(props) {
  return <Fade
    {...props}
    timeout={{
      apper: 0,
      enter: 500,
      exit: 300,
    }}
  />
}



export default function Flash() {
  const flash = usePage().props.flash

  // フラッシュがなければ空を返す。
  if (null === flash.message) return(<></>)

  const [state, setState] = React.useState({
    open: (flash.message !== null),
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, open } = state;

  const [marginTop, setMarginTop] = React.useState(0);


  const handleClose = () => {
    setState({ ...state, open: false });
    setMarginTop(0)
  };

  React.useEffect(() => {
    setMarginTop(10)
  }, [])

  return (
        <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        TransitionComponent={ hide}
        key={vertical + horizontal}
          sx={{
              marginTop: marginTop,
              transition: "margin-top 0.25s ease-out",
          }}
        >
          <Alert onClose={handleClose} severity={flash.status}
            sx={{
              width: '100%',
              maxWidth: '300px',
            }}>
            { nl2br(flash.message) }
          </Alert>

        </Snackbar>
  );
}
