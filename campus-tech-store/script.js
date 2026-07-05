const { useMemo, useState } = React;
const h = React.createElement;

// Small product list made for the assignment prototype.
// The products are fake, but the filters and cart actually work.
const products = [
  {
    id: 1,
    name: 'StudyBuds Wireless Headphones',
    category: 'Audio',
    brand: 'Sony',
    price: 74.99,
    rating: 4.6,
    useCase: 'Studying',
    emoji: '🎧',
    description: 'Wireless headphones with soft ear pads and noise reduction for studying on campus.'
  },
  {
    id: 2,
    name: 'Foldable Laptop Stand',
    category: 'Desk Setup',
    brand: 'Generic',
    price: 32.99,
    rating: 4.3,
    useCase: 'Desk Setup',
    emoji: '💻',
    description: 'A simple adjustable stand that helps raise your laptop screen during long work sessions.'
  },
  {
    id: 3,
    name: 'Compact Bluetooth Keyboard',
    category: 'Keyboards',
    brand: 'Logitech',
    price: 49.99,
    rating: 4.5,
    useCase: 'Studying',
    emoji: '⌨️',
    description: 'A small keyboard for typing notes, coding assignments, and keeping a desk less crowded.'
  },
  {
    id: 4,
    name: '30W USB-C Fast Charger',
    category: 'Chargers',
    brand: 'Anker',
    price: 27.99,
    rating: 4.8,
    useCase: 'Travel',
    emoji: '🔌',
    description: 'A backpack-friendly charger that works well for phones, tablets, and some laptops.'
  },
  {
    id: 5,
    name: 'Wireless Mouse',
    category: 'Mice',
    brand: 'Logitech',
    price: 22.99,
    rating: 4.2,
    useCase: 'Desk Setup',
    emoji: '🖱️',
    description: 'A basic wireless mouse for people who do not want to use a trackpad all day.'
  },
  {
    id: 6,
    name: '128GB USB-C Flash Drive',
    category: 'Storage',
    brand: 'SanDisk',
    price: 19.99,
    rating: 4.4,
    useCase: 'Studying',
    emoji: '💾',
    description: 'A small drive for saving assignments, photos, and project backups.'
  },
  {
    id: 7,
    name: '10K Portable Battery Pack',
    category: 'Chargers',
    brand: 'Anker',
    price: 44.99,
    rating: 4.7,
    useCase: 'Travel',
    emoji: '🔋',
    description: 'A portable battery for long class days when there are no outlets nearby.'
  },
  {
    id: 8,
    name: 'Large Desk Mat',
    category: 'Desk Setup',
    brand: 'Generic',
    price: 18.99,
    rating: 4.1,
    useCase: 'Gaming',
    emoji: '🟦',
    description: 'A large mouse pad that makes a desk setup cleaner and more comfortable.'
  }
];

const categories = [...new Set(products.map(p => p.category))];
const brands = [...new Set(products.map(p => p.brand))];
const uses = [...new Set(products.map(p => p.useCase))];

const stepNames = ['Cart', 'Info', 'Payment', 'Review', 'Done'];

function money(value) {
  return '$' + value.toFixed(2);
}

function App() {
  const [page, setPage] = useState('shop');
  const [cart, setCart] = useState([]);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [expanded, setExpanded] = useState(null);
  const [surveyDone, setSurveyDone] = useState(false);
  const [errors, setErrors] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    brand: 'All',
    useCase: 'All',
    price: 'All',
    rating: '0',
    sort: 'name'
  });
  const [info, setInfo] = useState({ name: '', email: '', address: '', city: '', postal: '' });
  const [payment, setPayment] = useState({ cardName: '', cardNumber: '', expiry: '', cvv: '' });
  const [survey, setSurvey] = useState({ rating: '5', comment: '', easy: 'Yes' });

  const filteredProducts = useMemo(() => {
    let list = products.filter(product => {
      const searchMatch = product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase());
      const categoryMatch = filters.category === 'All' || product.category === filters.category;
      const brandMatch = filters.brand === 'All' || product.brand === filters.brand;
      const useMatch = filters.useCase === 'All' || product.useCase === filters.useCase;
      const ratingMatch = product.rating >= Number(filters.rating);
      let priceMatch = true;

      if (filters.price === 'under25') priceMatch = product.price < 25;
      if (filters.price === '25to50') priceMatch = product.price >= 25 && product.price <= 50;
      if (filters.price === 'over50') priceMatch = product.price > 50;

      return searchMatch && categoryMatch && brandMatch && useMatch && ratingMatch && priceMatch;
    });

    if (filters.sort === 'low') list.sort((a, b) => a.price - b.price);
    if (filters.sort === 'high') list.sort((a, b) => b.price - a.price);
    if (filters.sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    if (filters.sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [filters]);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  function changeFilter(key, value) {
    setFilters({ ...filters, [key]: value });
  }

  function clearFilters() {
    setFilters({ search: '', category: 'All', brand: 'All', useCase: 'All', price: 'All', rating: '0', sort: 'name' });
  }

  function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    setPage('cart');
  }

  function updateQty(id, amount) {
    setCart(cart.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + amount) } : item));
  }

  function removeFromCart(id) {
    setCart(cart.filter(item => item.id !== id));
  }

  function startCheckout() {
    if (cart.length === 0) {
      setErrors('Add at least one product before checking out.');
      return;
    }
    setErrors('');
    setCheckoutStep(1);
    setPage('checkout');
  }

  function validateInfo() {
    if (!info.name || !info.email || !info.address || !info.city || !info.postal) {
      setErrors('Please fill in all shipping information before continuing.');
      return false;
    }
    setErrors('');
    return true;
  }

  function validatePayment() {
    if (!payment.cardName || !payment.cardNumber || !payment.expiry || !payment.cvv) {
      setErrors('Please complete the payment form. This is only a prototype, so do not use real card details.');
      return false;
    }
    setErrors('');
    return true;
  }

  function nextStep() {
    if (checkoutStep === 1 && !validateInfo()) return;
    if (checkoutStep === 2 && !validatePayment()) return;
    setCheckoutStep(checkoutStep + 1);
  }

  function submitSurvey(event) {
    event.preventDefault();
    setSurveyDone(true);
  }

  return h('div', { className: 'app' },
    h(Header, { page, setPage, itemCount }),
    h('main', { className: 'container' },
      page === 'shop' && h(ShopPage, {
        filters, changeFilter, clearFilters, filteredProducts, expanded, setExpanded, addToCart
      }),
      page === 'cart' && h(CartPage, { cart, total, updateQty, removeFromCart, startCheckout, setPage, errors }),
      page === 'checkout' && h(CheckoutPage, {
        cart, total, checkoutStep, setCheckoutStep, info, setInfo, payment, setPayment,
        nextStep, errors, setPage
      }),
      page === 'survey' && h(SurveyPage, { survey, setSurvey, submitSurvey, surveyDone })
    ),
    h('footer', null, 'Built by Ayaan Nawab • SEG3125 E-Commerce Assignment')
  );
}

function Header({ page, setPage, itemCount }) {
  return h('header', null,
    h('div', { className: 'header-wrap' },
      h('button', { className: 'logo', onClick: () => setPage('shop') },
        h('span', null, '💻'),
        h('div', null,
          h('strong', null, 'CampusTech Store'),
          h('small', null, 'student tech accessories')
        )
      ),
      h('nav', null,
        h('button', { className: page === 'shop' ? 'active' : '', onClick: () => setPage('shop') }, 'Shop'),
        h('button', { className: page === 'cart' ? 'active' : '', onClick: () => setPage('cart') }, `Cart (${itemCount})`),
        h('button', { className: page === 'survey' ? 'active' : '', onClick: () => setPage('survey') }, 'Survey')
      )
    )
  );
}

function ShopPage({ filters, changeFilter, clearFilters, filteredProducts, expanded, setExpanded, addToCart }) {
  return h(React.Fragment, null,
    h('section', { className: 'hero' },
      h('div', null,
        h('p', { className: 'tag' }, 'Back-to-school deals'),
        h('h1', null, 'Useful tech for students without making shopping complicated.'),
        h('p', null, 'Browse affordable accessories for studying, gaming, commuting, and building a better desk setup.'),
        h('a', { href: '#products', className: 'main-link' }, 'Shop the deals')
      ),
      h('div', { className: 'hero-box' },
        h('h3', null, 'Student Bundle'),
        h('p', null, 'Keyboard + mouse + desk mat'),
        h('strong', null, 'Save 15% this week!')
      )
    ),
    h('section', { id: 'products', className: 'shop-layout' },
      h(FilterPanel, { filters, changeFilter, clearFilters }),
      h('div', { className: 'products-area' },
        h('div', { className: 'results-row' },
          h('h2', null, 'Products'),
          h('span', null, `${filteredProducts.length} result${filteredProducts.length === 1 ? '' : 's'}`)
        ),
        filteredProducts.length === 0
          ? h('div', { className: 'empty' }, 'No products match those filters. Try clearing one of them.')
          : h('div', { className: 'product-grid' },
              filteredProducts.map(product => h(ProductCard, {
                key: product.id,
                product,
                expanded: expanded === product.id,
                onToggle: () => setExpanded(expanded === product.id ? null : product.id),
                onAdd: () => addToCart(product)
              }))
            )
      )
    )
  );
}

function FilterPanel({ filters, changeFilter, clearFilters }) {
  return h('aside', { className: 'filters' },
    h('h2', null, 'Filter products'),
    h('label', null, 'Search',
      h('input', {
        value: filters.search,
        onChange: e => changeFilter('search', e.target.value),
        placeholder: 'headphones, charger...'
      })
    ),
    h(SelectField, { label: 'Category', value: filters.category, options: ['All', ...categories], onChange: value => changeFilter('category', value) }),
    h(SelectField, { label: 'Brand', value: filters.brand, options: ['All', ...brands], onChange: value => changeFilter('brand', value) }),
    h(SelectField, { label: 'Use case', value: filters.useCase, options: ['All', ...uses], onChange: value => changeFilter('useCase', value) }),
    h(SelectField, { label: 'Price', value: filters.price, options: [
      ['All', 'Any price'], ['under25', 'Under $25'], ['25to50', '$25 to $50'], ['over50', 'Over $50']
    ], onChange: value => changeFilter('price', value) }),
    h(SelectField, { label: 'Minimum rating', value: filters.rating, options: [
      ['0', 'Any rating'], ['4', '4 stars and up'], ['4.5', '4.5 stars and up']
    ], onChange: value => changeFilter('rating', value) }),
    h(SelectField, { label: 'Sort by', value: filters.sort, options: [
      ['name', 'Name'], ['low', 'Price: low to high'], ['high', 'Price: high to low'], ['rating', 'Rating']
    ], onChange: value => changeFilter('sort', value) }),
    h('button', { className: 'secondary full', onClick: clearFilters }, 'Clear filters')
  );
}

function SelectField({ label, value, options, onChange }) {
  return h('label', null, label,
    h('select', { value, onChange: e => onChange(e.target.value) },
      options.map(option => {
        const val = Array.isArray(option) ? option[0] : option;
        const text = Array.isArray(option) ? option[1] : option;
        return h('option', { key: val, value: val }, text);
      })
    )
  );
}

function ProductCard({ product, expanded, onToggle, onAdd }) {
  return h('article', { className: 'product-card' },
    h('div', { className: 'product-emoji' }, product.emoji),
    h('p', { className: 'category' }, product.category),
    h('h3', null, product.name),
    h('p', null, product.description),
    expanded && h('ul', { className: 'details' },
      h('li', null, `Brand: ${product.brand}`),
      h('li', null, `Best for: ${product.useCase}`),
      h('li', null, `Rating: ${product.rating}/5`)
    ),
    h('div', { className: 'card-bottom' },
      h('strong', null, money(product.price)),
      h('span', null, `★ ${product.rating}`)
    ),
    h('div', { className: 'card-actions' },
      h('button', { className: 'secondary', onClick: onToggle }, expanded ? 'Hide details' : 'More info'),
      h('button', { onClick: onAdd }, 'Add to cart')
    )
  );
}

function CartPage({ cart, total, updateQty, removeFromCart, startCheckout, setPage, errors }) {
  return h('section', { className: 'plain-card' },
    h('h1', null, 'Your cart'),
    h('p', null, 'Check your items before moving to checkout.'),
    errors && h('p', { className: 'error' }, errors),
    cart.length === 0
      ? h('div', { className: 'empty' }, 'Your cart is empty right now.')
      : h('div', null,
          cart.map(item => h('div', { className: 'cart-row', key: item.id },
            h('span', { className: 'cart-emoji' }, item.emoji),
            h('div', { className: 'cart-main' },
              h('strong', null, item.name),
              h('small', null, `${money(item.price)} each`)
            ),
            h('div', { className: 'qty' },
              h('button', { onClick: () => updateQty(item.id, -1) }, '-'),
              h('span', null, item.qty),
              h('button', { onClick: () => updateQty(item.id, 1) }, '+')
            ),
            h('strong', null, money(item.price * item.qty)),
            h('button', { className: 'secondary', onClick: () => removeFromCart(item.id) }, 'Remove')
          )),
          h('div', { className: 'total-row' },
            h('span', null, 'Estimated total'),
            h('strong', null, money(total))
          )
        ),
    h('div', { className: 'page-actions' },
      h('button', { className: 'secondary', onClick: () => setPage('shop') }, 'Keep shopping'),
      h('button', { onClick: startCheckout }, 'Start checkout')
    )
  );
}

function CheckoutPage({ cart, total, checkoutStep, setCheckoutStep, info, setInfo, payment, setPayment, nextStep, errors, setPage }) {
  if (cart.length === 0) {
    return h('section', { className: 'plain-card' },
      h('h1', null, 'Checkout'),
      h('p', null, 'Your cart is empty, so there is nothing to checkout yet.'),
      h('button', { onClick: () => setPage('shop') }, 'Go to shop')
    );
  }

  return h('section', { className: 'plain-card' },
    h('h1', null, 'Checkout'),
    h('p', null, 'This step-by-step process shows what is done and what still needs to be completed.'),
    h(StepBar, { checkoutStep }),
    errors && h('p', { className: 'error' }, errors),
    checkoutStep === 1 && h(InfoForm, { info, setInfo }),
    checkoutStep === 2 && h(PaymentForm, { payment, setPayment }),
    checkoutStep === 3 && h(ReviewOrder, { cart, total, info }),
    checkoutStep === 4 && h(Confirmation, { total, setPage }),
    checkoutStep < 4 && h('div', { className: 'page-actions' },
      checkoutStep > 1
        ? h('button', { className: 'secondary', onClick: () => setCheckoutStep(checkoutStep - 1) }, 'Back')
        : h('button', { className: 'secondary', onClick: () => setPage('cart') }, 'Back to cart'),
      h('button', { onClick: nextStep }, checkoutStep === 3 ? 'Place order' : 'Continue')
    )
  );
}

function StepBar({ checkoutStep }) {
  return h('div', { className: 'steps' },
    stepNames.map((step, index) => h('div', {
      key: step,
      className: index < checkoutStep ? 'step done' : index === checkoutStep ? 'step current' : 'step'
    },
      h('span', null, index + 1),
      h('small', null, step)
    ))
  );
}

function InfoForm({ info, setInfo }) {
  function update(key, value) {
    setInfo({ ...info, [key]: value });
  }
  return h('div', { className: 'form-grid' },
    h(Input, { label: 'Full name', value: info.name, onChange: value => update('name', value) }),
    h(Input, { label: 'Email', value: info.email, onChange: value => update('email', value) }),
    h(Input, { label: 'Address', value: info.address, onChange: value => update('address', value) }),
    h(Input, { label: 'City', value: info.city, onChange: value => update('city', value) }),
    h(Input, { label: 'Postal code', value: info.postal, onChange: value => update('postal', value) })
  );
}

function PaymentForm({ payment, setPayment }) {
  function update(key, value) {
    setPayment({ ...payment, [key]: value });
  }
  return h('div', null,
    h('div', { className: 'form-grid' },
      h(Input, { label: 'Name on card', value: payment.cardName, onChange: value => update('cardName', value) }),
      h(Input, { label: 'Card number', value: payment.cardNumber, onChange: value => update('cardNumber', value), placeholder: '1111 2222 3333 4444' }),
      h(Input, { label: 'Expiry', value: payment.expiry, onChange: value => update('expiry', value), placeholder: 'MM/YY' }),
      h(Input, { label: 'CVV', value: payment.cvv, onChange: value => update('cvv', value), placeholder: '123' })
    )
  );
}

function Input({ label, value, onChange, placeholder = '' }) {
  return h('label', null, label,
    h('input', { value, placeholder, onChange: e => onChange(e.target.value) })
  );
}

function ReviewOrder({ cart, total, info }) {
  return h('div', null,
    h('h2', null, 'Review your order'),
    cart.map(item => h('p', { key: item.id }, `${item.qty} × ${item.name} — ${money(item.price * item.qty)}`)),
    h('p', null, `Shipping to: ${info.name}, ${info.city}`),
    h('h3', null, `Total: ${money(total)}`)
  );
}

function Confirmation({ total, setPage }) {
  return h('div', { className: 'confirmation' },
    h('h2', null, 'Order confirmed!'),
    h('p', null, `Thanks for shopping with CampusTech Store. Your prototype total was ${money(total)}.`),
    h('p', null, 'A real site would send an email receipt here.'),
    h('button', { onClick: () => setPage('survey') }, 'Fill out the survey')
  );
}

function SurveyPage({ survey, setSurvey, submitSurvey, surveyDone }) {
  function update(key, value) {
    setSurvey({ ...survey, [key]: value });
  }

  return h('section', { className: 'plain-card' },
    h('h1', null, 'Quick feedback survey'),
    h('p', null, 'How was your shopping experience? Your feedback helps us make the store easier for students to use.'),
    surveyDone
      ? h('div', { className: 'confirmation' },
          h('h2', null, 'Thank you!'),
          h('p', null, 'Your feedback was submitted in this prototype.')
        )
      : h('form', { onSubmit: submitSurvey, className: 'survey-form' },
          h(SelectField, { label: 'Overall rating', value: survey.rating, options: ['5', '4', '3', '2', '1'], onChange: value => update('rating', value) }),
          h(SelectField, { label: 'Was the site easy to use?', value: survey.easy, options: ['Yes', 'Somewhat', 'No'], onChange: value => update('easy', value) }),
          h('label', null, 'Comment',
            h('textarea', {
              value: survey.comment,
              onChange: e => update('comment', e.target.value),
              placeholder: 'Write a short comment about the site...'
            })
          ),
          h('button', null, 'Submit feedback')
        )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(h(App));
