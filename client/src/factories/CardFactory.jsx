import ProductCard from '../views/components/cards/ProductCard.jsx'
import MerchCard   from '../views/components/cards/MerchCard.jsx'
import TicketCard  from '../views/components/cards/TicketCard.jsx'

export class CardFactory {
  static create(type, props) {
    switch (type?.toLowerCase()) {
      case 'beer':
      case 'beers':
      case 'cocktail':
      case 'cocktails':
      case 'food':
        return <ProductCard key={props.id} {...props} />
      case 'merch':
        return <MerchCard key={props.id} {...props} />
      case 'ticket':
      case 'tickets':
        return <TicketCard key={props.id} {...props} />
      default:
        return <ProductCard key={props.id} {...props} />
    }
  }
}
