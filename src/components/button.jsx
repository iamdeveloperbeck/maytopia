
export default function Button(props) {
  return (
    <button {...props} className='bg-primary text-primary-foreground hover:bg-primary/90'>{props.children}</button>
  )
}
