const Connection = require('../Model/Connection');
const User = require('../Model/UserModel');


const requestConnection = async (req, res) => {
  const { recipientId } = req.body;
  if (!recipientId) return res.status(400).json({ message: 'recipientId required' });

  const existing = await Connection.findOne({ requesterId: req.user._id, recipientId });
  if (existing) return res.status(400).json({ message: 'Already requested' });

  const conn = await Connection.create({ requesterId: req.user._id, recipientId, status: 'PENDING' });
  res.json(conn);
};

const updateConnection = async (req, res) => {
  const conn = await Connection.findById(req.params.connectionId);
  if (!conn) return res.status(404).json({ message: 'Not found' });


  if (
    !conn.recipientId.equals(req.user._id) &&
    !conn.requesterId.equals(req.user._id) &&
    req.user.userType !== 'ADMIN'
  ) {
    return res.status(403).json({ message: 'Not allowed' });
  }

  conn.status = req.body.status || conn.status;
  await conn.save();
  res.json(conn);
};


const myNetwork = async (req, res) => {
  const accepted = await Connection.find({
    $or: [
      { requesterId: req.user._id },
      { recipientId: req.user._id }
    ],
    status: 'ACCEPTED'
  });

  const ids = accepted
    .flatMap(c => [c.requesterId.toString(), c.recipientId.toString()])
    .filter(id => id !== req.user._id.toString());

  const users = await User.find({ _id: { $in: ids } }).select('name email avatar userType');
  res.json(users);
};


const suggestions = async (req, res) => {
  const connected = await Connection.find({
    $or: [
      { requesterId: req.user._id },
      { recipientId: req.user._id }
    ]
  });

  const connectedIds = connected.flatMap(c => [
    c.requesterId.toString(),
    c.recipientId.toString(),
    req.user._id.toString()
  ]);

  const suggestions = await User.find({ _id: { $nin: connectedIds } })
    .limit(10)
    .select('name avatar userType');

  res.json(suggestions);
};

module.exports = {
  requestConnection,
  updateConnection,
  myNetwork,
  suggestions
};
