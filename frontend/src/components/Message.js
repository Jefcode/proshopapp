import Alert from 'react-bootstrap/Alert';

const Message = ({ variant = 'info', children }) => {
  return <Alert variant={variant}>{children}</Alert>;
};

export default Message;
